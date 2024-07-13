export const create_news_letter_payload = {
  title: 'test title',
  content: 'test content',
  author: 'New Author',
  subscribers: ['668fb93fc188ab6add675386'],
  tags: ['test'],
  isPublished: true,
};

export const update_news_letter_payload = {
  title: 'test title updated',
  content: 'test content updated',
  author: 'New Author',
  subscribers: ['668fb93fc188ab6add675386'],
  tags: ['test update'],
  isPublished: false,
};

export const news_letter_with_invalid_subscriber_payload = {
  title: 'test title',
  content: 'test content',
  author: 'New Author',
  subscribers: ['668fb93fc188ab6add675776'],
  tags: ['test'],
  isPublished: true,
};
