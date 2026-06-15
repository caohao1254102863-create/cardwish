-- ============================================================
-- Seed Data: Categories & Card Templates
-- ============================================================

-- Categories
INSERT INTO categories (slug, name_zh, name_en, icon, sort_order) VALUES
  ('birthday', '生日祝福', 'Birthday', '🎂', 1),
  ('love', '浪漫爱情', 'Love & Romance', '💕', 2),
  ('flowers', '鲜花祝福', 'Flowers', '💐', 3),
  ('coffee', '咖啡茶饮', 'Coffee & Tea', '☕', 4),
  ('cake', '蛋糕甜点', 'Cakes & Desserts', '🍰', 5),
  ('thanks', '感谢有你', 'Thank You', '🙏', 6),
  ('congratulations', '祝贺庆祝', 'Congratulations', '🎉', 7),
  ('mystery', '神秘盲盒', 'Mystery Box', '🎁', 8),
  ('encouragement', '加油鼓励', 'Encouragement', '💪', 9),
  ('friendship', '友谊长存', 'Friendship', '🤝', 10);

-- Birthday cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='birthday'), '缤纷生日蛋糕', 'Colorful Birthday Cake', '精美的生日蛋糕卡片，送上最甜蜜的祝福', 'A beautiful birthday cake card with the sweetest wishes', 2900, 'USD', '["Hot", "New"]', 1),
  ((SELECT id FROM categories WHERE slug='birthday'), '星空生日祝福', 'Starry Birthday Wish', '漫天繁星为你庆生，愿你的每一天都闪闪发光', 'Stars across the sky celebrating your special day', 2500, 'USD', '["Popular"]', 2),
  ((SELECT id FROM categories WHERE slug='birthday'), '欢乐派对时刻', 'Party Time', '五彩缤纷的派对卡片，让生日更精彩', 'Colorful party vibes for an amazing birthday', 3500, 'USD', '["New"]', 3);

-- Love cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='love'), '玫瑰之约', 'Rose Promise', '99朵玫瑰，传递最真挚的爱意', '99 roses conveying the most sincere love', 3900, 'USD', '["Hot"]', 1),
  ((SELECT id FROM categories WHERE slug='love'), '心动巧克力', 'Heartbeat Chocolate', '甜蜜的巧克力礼盒，每一颗都是心动的感觉', 'Sweet chocolate box, each piece a heartbeat', 2800, 'USD', '["Popular"]', 2),
  ((SELECT id FROM categories WHERE slug='love'), '浪漫星空', 'Romantic Starry Night', '在星空下许愿，愿我们的爱情永恒', 'Wishing under the stars for eternal love', 3200, 'USD', '[]', 3);

-- Flowers cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='flowers'), '春日花束', 'Spring Bouquet', '一束春天的花，带来满满的生机与希望', 'A bouquet of spring, full of life and hope', 2500, 'USD', '["Popular"]', 1),
  ((SELECT id FROM categories WHERE slug='flowers'), '向日葵之约', 'Sunflower Promise', '像向日葵一样，永远向着阳光', 'Like a sunflower, always facing the sun', 2200, 'USD', '[]', 2),
  ((SELECT id FROM categories WHERE slug='flowers'), '浪漫玫瑰园', 'Romantic Rose Garden', '满园玫瑰，只为最美的你', 'A garden of roses for the most beautiful you', 4500, 'USD', '["Hot"]', 3);

-- Coffee cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='coffee'), '暖心拿铁', 'Warm Latte', '一杯暖暖的拿铁，温暖你的每一天', 'A warm latte to warm up your every day', 1500, 'USD', '["Popular"]', 1),
  ((SELECT id FROM categories WHERE slug='coffee'), '抹茶星冰乐', 'Matcha Frappuccino', '清新的抹茶，带来一天的好心情', 'Refreshing matcha for a cheerful day', 1800, 'USD', '["New"]', 2),
  ((SELECT id FROM categories WHERE slug='coffee'), '经典美式', 'Classic Americano', '简约而不简单，就像最好的时光', 'Simple but not plain, just like the best moments', 1200, 'USD', '[]', 3);

-- Cake cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='cake'), '草莓奶油蛋糕', 'Strawberry Cream Cake', '新鲜草莓搭配奶油，甜蜜的幸福滋味', 'Fresh strawberries with cream, the taste of happiness', 3500, 'USD', '["Hot"]', 1),
  ((SELECT id FROM categories WHERE slug='cake'), '提拉米苏', 'Tiramisu', '经典意式提拉米苏，带我走', 'Classic Italian tiramisu — pick me up', 3800, 'USD', '["Popular"]', 2),
  ((SELECT id FROM categories WHERE slug='cake'), '马卡龙礼盒', 'Macaron Box', '五彩缤纷的马卡龙，每一颗都是艺术品', 'Colorful macarons, each one a work of art', 4200, 'USD', '["New"]', 3);

-- Thank you cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='thanks'), '感恩花束', 'Gratitude Bouquet', '用一束花表达最真诚的感谢', 'Express the sincerest gratitude with a bouquet', 2000, 'USD', '["Popular"]', 1),
  ((SELECT id FROM categories WHERE slug='thanks'), '温馨感谢卡', 'Warm Thank You Card', '一句谢谢，温暖人心', 'A simple thank you that warms the heart', 1200, 'USD', '[]', 2);

-- Congratulations cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='congratulations'), '金色庆典', 'Golden Celebration', '金色时刻，值得被铭记', 'Golden moments worth remembering', 3200, 'USD', '["Popular"]', 1),
  ((SELECT id FROM categories WHERE slug='congratulations'), '毕业快乐', 'Happy Graduation', '庆祝人生的重要里程碑', 'Celebrating an important life milestone', 2800, 'USD', '[]', 2),
  ((SELECT id FROM categories WHERE slug='congratulations'), '升职庆祝', 'Promotion Celebration', '恭喜升职，未来可期', 'Congratulations on the promotion, the future is bright', 3500, 'USD', '["New"]', 3);

-- Mystery box cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='mystery'), '幸运盲盒', 'Lucky Mystery Box', '打开盲盒，收获一份惊喜', 'Open the mystery box for a surprise', 990, 'USD', '["Hot"]', 1),
  ((SELECT id FROM categories WHERE slug='mystery'), '豪华盲盒', 'Deluxe Mystery Box', '更高级的惊喜体验', 'A premium surprise experience', 1990, 'USD', '["Popular"]', 2),
  ((SELECT id FROM categories WHERE slug='mystery'), '超级盲盒', 'Super Mystery Box', '终极惊喜，不容错过', 'The ultimate surprise, don''t miss out', 4990, 'USD', '[]', 3);

-- Encouragement cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='encouragement'), '加油打气卡', 'Cheer Up Card', '你比你想象的更强大，加油！', 'You are stronger than you think, keep going!', 1500, 'USD', '["Popular"]', 1),
  ((SELECT id FROM categories WHERE slug='encouragement'), '温暖拥抱', 'Warm Hug', '给你一个温暖的拥抱', 'A warm hug just for you', 1800, 'USD', '[]', 2);

-- Friendship cards
INSERT INTO card_templates (category_id, name_zh, name_en, description_zh, description_en, price_cents, currency, tags, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug='friendship'), '友谊长存', 'Forever Friends', '最好的朋友，最美的时光', 'Best friends, best times', 2000, 'USD', '["Popular"]', 1),
  ((SELECT id FROM categories WHERE slug='friendship'), '闺蜜时光', 'Bestie Time', '和闺蜜在一起的每一天都是晴天', 'Every day with your bestie is a sunny day', 2200, 'USD', '["Hot"]', 2);
