# Language Learning App with Node.js

This is full stack application that helps students to learn forign language grammar. The teacher can add, update, delete the words and their meaning.
Students can learn these words and then take a test, after which they will get a score.

## Database Table Structure

The application uses MySQL Database. Run the following statements on the database server to create table.

```
CREATE TABLE category_master(
id INT AUTO_INCREMENT PRIMARY KEY,
NAME VARCHAR(100)
);
```

```
CREATE TABLE eng_word_master(
id INT AUTO_INCREMENT PRIMARY KEY,
word VARCHAR(100) NOT NULL,
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

There are categories (optional) for the words that the teacher adds. You can insert some sample categories in the table category_master. Run the following statement.

```
INSERT INTO category_master (name) VALUES ("ANIMALS");
INSERT INTO category_master (name) VALUES ("COLORS");
```

## Deploying the Application

1. Clone the github repository
   ```
   git clone https://github.com/ankitashanbhag08/learn-languages-shanbhag-ankita.git
   ```
2. On you cygwin terminal, navigate to the root folder and install the dependencies.
   ```
   cd learn-languages-shanbhag-ankita
   npm install
   ```
3. On you cygwin terminal, navigate to the learn-languages-shanbhag-ankita/frontend folder and install the dependencies.
   ```
   cd frontend
   npm install
   ```
4. Add a .env file in folder "learn-languages-shanbhag-ankita" (in the root folder). Add the following parameters corresponding to your database.
   ```
   DB_HOST =
   DB_USER =
   DB_PASSWORD =
   DB_DB =
   ```
5. In the cygwin terminal, make sure that you are inside the folder "learn-languages-shanbhag-ankita". Start the backend server
   ```
   nodemon index.js
   ```
6. You can now access the [application] (http://localhost:8080/)
