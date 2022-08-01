import { App } from '@slack/bolt';
import { deleteDms, fetchExpiredDms } from '../models/dm/dm.service';

export function deleteExpiredDms(app: App) {
  app.use(async ({ client, next }) => {
    const dmResp = await fetchExpiredDms();

    const dms = dmResp.data || [];

    if (dms.length > 0) {
      deleteDms(dms.map(dm => dm.id));

      dms.forEach(async dm => {
        await client.chat.delete({
          channel: dm.channel_id,
          ts: dm.timestamp,
        });
      });
    }

    await next();
  });
}
