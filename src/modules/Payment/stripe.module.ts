import { DynamicModule, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';

const STRIPE_SERVICE_KEY = 'STRIPE_SERVICE';

export const InjectStripe = () => Inject(STRIPE_SERVICE_KEY);

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class StripeModule {
  static registerAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [],
      providers: [
        {
          provide: STRIPE_SERVICE_KEY,
          useFactory: (configService: ConfigService) => {
            return new Stripe(configService.get<string>('STRIPE_API_KEY'));
          },
          inject: [ConfigService],
        },
      ],
      exports: [STRIPE_SERVICE_KEY],
    };
  }
}
