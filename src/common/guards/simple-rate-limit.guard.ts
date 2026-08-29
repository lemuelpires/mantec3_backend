import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
export class SimpleRateLimitGuard implements CanActivate {
  private readonly hits = new Map<string, RateLimitEntry>();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride<RateLimitOptions | undefined>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      ip?: string;
      headers: Record<string, string | string[] | undefined>;
      originalUrl?: string;
      route?: { path?: string };
    }>();
    const now = Date.now();
    const key = this.getKey(request, options);
    const current = this.hits.get(key);

    if (!current || current.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + options.windowMs });
      this.cleanup(now);
      return true;
    }

    current.count += 1;
    if (current.count > options.limit) {
      throw new HttpException(
        'Muitas tentativas. Aguarde um momento e tente novamente.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getKey(
    request: { ip?: string; headers: Record<string, string | string[] | undefined>; originalUrl?: string; route?: { path?: string } },
    options: RateLimitOptions,
  ) {
    const ip = request.ip || 'unknown';
    const route = request.route?.path || request.originalUrl || 'route';

    return `${options.keyPrefix || route}:${ip}`;
  }

  private cleanup(now: number) {
    if (this.hits.size < 1000) {
      return;
    }

    for (const [key, entry] of this.hits.entries()) {
      if (entry.resetAt <= now) {
        this.hits.delete(key);
      }
    }
  }
}
