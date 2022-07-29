import { App } from '@slack/bolt';

export function initLogger(app: App) {
  app.use(async ({ body, payload, next }) => {
    if ('view' in payload) {
      delete payload.view;
    }
    // if ('event' in body) {
    //   if ('view' in body.event) {
    //     delete body.event.view;
    //   }
    // }
    console.dir({ payload /* body */ }, { depth: null });
    await next();
  });
}
