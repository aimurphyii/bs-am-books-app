DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn NUMERIC(20),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)   
);



INSERT INTO books (title, author, isbn, image_url, description, bookshelf)
VALUES('Just So Stories', 'Kipling', '39015010350141', 'http://books.google.com/books/content?id=RwBbAAAAMAAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api', 'Twelve stories about animals and insects including How the Camel Got His Hump; How the First Letter was Written, and How the Rhinoceros Got His Skin.', 'End game');


INSERT INTO books (title, author, isbn, image_url, description, bookshelf)
VALUES('buddy','who', '4598734957','https://jfydhgfyhdthosg', 'he\''s an elf?', 'buddy the elf');