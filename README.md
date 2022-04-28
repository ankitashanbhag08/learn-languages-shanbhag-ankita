# Language Learning App with Node.js

This is full stack application that helps students to learn forign language grammar. The teacher can add, update, delete the words and their meaning.
Students can learn these words and then take a test, after which they will get a score.

## Database Table Structure

The application uses MySQL Database. Run the following statements on the database server.

```
CREATE TABLE category_master(
id INT AUTO_INCREMENT PRIMARY KEY,
NAME VARCHAR(100)
);
```

```
CREATE TABLE eng_word_master(
id INT AUTO_INCREMENT PRIMARY KEY,
word VARCHAR(100),
category_id INT,
FOREIGN KEY(category_id) REFERENCES category_master(id)
ON DELETE SET NULL ON UPDATE CASCADE
);
```

```
CREATE TABLE fin_word_master(
id INT AUTO_INCREMENT PRIMARY KEY,
word VARCHAR(100),
category_id INT,
FOREIGN KEY(category_id) REFERENCES category_master(id)
ON DELETE SET NULL ON UPDATE CASCADE
);
```

```
CREATE TABLE word_meaning(
id INT AUTO_INCREMENT PRIMARY KEY,
eng_id INT,
fin_id INT,
FOREIGN KEY(eng_id) REFERENCES eng_word_master(id)
ON DELETE SET NULL ON UPDATE CASCADE,
FOREIGN KEY(fin_id) REFERENCES fin_word_master(id)
ON DELETE SET NULL ON UPDATE CASCADE
);
```
