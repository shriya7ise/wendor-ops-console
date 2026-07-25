import { Controller, Get } from '@nestjs/common';

// Analytics > Custom Analytics — matches the source app's own empty state
// (a real "request a custom dashboard" flow, not a broken page).
@Controller('analytics/custom')
export class CustomAnalyticsController {
  @Get()
  get() {
    return {
      available: false,
      message: 'No Analytics available. Please contact us on WhatsApp to request a dashboard.',
      contactWhatsapp: process.env.CUSTOM_ANALYTICS_WHATSAPP ?? '+910000000000',
    };
  }
}
