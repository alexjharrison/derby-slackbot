import { ModalView } from '@slack/bolt';
import { format } from 'date-fns';
import { Event } from '../../../models/event/event.interface';

export function EventEditView(event?: Event): ModalView {
  const view: ModalView = {
    type: 'modal',
    callback_id: 'event_edit_modal',
    submit: {
      type: 'plain_text',
      text: 'Save',
    },
    close: {
      text: 'Cancel',
      type: 'plain_text',
    },
    title: {
      text: `${event ? 'Edit' : 'Create'} Event`,
      type: 'plain_text',
    },
    ...(event?.id && { private_metadata: `${event.id}` }),
    blocks: [
      {
        type: 'input',
        block_id: 'title',
        label: {
          type: 'plain_text',
          text: 'Title',
        },
        element: {
          type: 'plain_text_input',
          focus_on_load: true,
          action_id: 'data',
          ...(event?.title && { initial_value: event.title }),
          placeholder: {
            text: 'Enter event title...',
            type: 'plain_text',
          },
        },
      },
      {
        type: 'input',
        block_id: 'date',
        label: {
          text: 'Date',
          type: 'plain_text',
        },
        element: {
          type: 'datepicker',
          action_id: 'data',
          ...(event?.start_date && {
            initial_date: format(new Date(event.start_date), 'yyyy-MM-dd'),
          }),
        },
      },
      {
        type: 'input',
        block_id: 'start_time',
        label: {
          text: 'Start Time',
          type: 'plain_text',
        },
        element: {
          type: 'timepicker',
          action_id: 'data',
          placeholder: {
            text: 'Select start time',
            type: 'plain_text',
          },
          ...(event?.start_date && {
            initial_time: format(new Date(event.start_date), 'HH:mm'),
          }),
        },
      },
      {
        type: 'input',
        optional: true,
        block_id: 'end_time',
        label: {
          text: 'End Time',
          type: 'plain_text',
        },
        element: {
          type: 'timepicker',
          action_id: 'data',
          placeholder: {
            text: 'Select end time',
            type: 'plain_text',
          },
          ...(event?.end_date && {
            initial_time: format(new Date(event.end_date), 'HH:mm'),
          }),
        },
      },
      {
        type: 'input',
        optional: true,
        block_id: 'location_name',
        label: {
          text: 'Location Name',
          type: 'plain_text',
        },
        element: {
          type: 'plain_text_input',
          action_id: 'data',
          ...(event?.location_name && { initial_value: event.location_name }),
          placeholder: {
            text: 'Enter location name',
            type: 'plain_text',
          },
        },
      },
      {
        type: 'input',
        optional: true,
        block_id: 'location_address',
        label: {
          text: 'Location Address',
          type: 'plain_text',
        },
        element: {
          type: 'plain_text_input',
          action_id: 'data',
          ...(event?.location_address && {
            initial_value: event.location_address,
          }),
          placeholder: {
            text: 'Enter full address',
            type: 'plain_text',
          },
        },
      },
      {
        type: 'input',
        optional: true,
        block_id: 'details',
        label: {
          type: 'plain_text',
          text: 'Details',
        },
        element: {
          type: 'plain_text_input',
          multiline: true,
          action_id: 'data',
          ...(event?.details && { initial_value: event.details }),
          placeholder: {
            text: 'Enter event details',
            type: 'plain_text',
          },
        },
      },
    ],
  };

  return view;
}
