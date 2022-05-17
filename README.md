# Language Learning App with Node.js

This is full stack application that helps students to learn forign language grammar. The teacher can add, update, delete the words and their meaning.
Students can learn these words and then take a test, after which they will get a score.

## Demo of Language Learning App

A demo of this application can be found here.
[![Link To Video](https://img.youtube.com/vi/IMr3McKi8ag/0.jpg)](https://www.youtube.com/watch?v=IMr3McKi8ag)

### Time stamps in the video are as follows:

0:00 - 7:20 - Demo of application
7:21 - 11:25 - Relevant code
11:25 - 12:30 - Bugs and self evaluation.

## Database Structure

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
CREATE TABLE german_word_master(
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
german_id INT,
FOREIGN KEY(eng_id) REFERENCES eng_word_master(id)
ON DELETE SET NULL ON UPDATE CASCADE,
FOREIGN KEY(fin_id) REFERENCES fin_word_master(id)
ON DELETE SET NULL ON UPDATE CASCADE,
FOREIGN KEY(german_id) REFERENCES german_word_master(id)
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
6. You can now access the [application](http://localhost:8080/)

The links mentioned in front end components are relative. If you want to access the frontend directly make the links absolute in Teach.js, TakeTest.js and Learn.js. i.e. replace /teach with http://localhost:8080/teach.js and so on.

## Screenshots

The "Learn Tab" displays list of all foreign words. The student can learn these words before taking a test.

![Learn Words](/assets/images/displayLearn.png)

Student can search any word/ forign word/category using search bar. The table also has pagination facility.

![Search Words](/assets/images/search_pagination.png)

A teacher can add new word through "Teach Tab". The category is optional.

![Add Words](/assets/images/addWord.png)

By clicking on icons under "Action" column, the teacher can edit or delete the words.

![Edit Words](/assets/images/edit_del.jpg)

A teacher can also add new category. Just write the name of new category and press "Spacebar"

![Add Category](/assets/images/addCategory.png)

The table also has pagination facility.

![Pagination](/assets/images/rows.png)

A student can take a test through Take Test Tab. He needs to select 2 languages - one that he knows and other he wants to learn. Select category (but it's optional). If category is not selected, questions appear from random category. Click on start test button.

![Take Test](/assets/images/taketest.png)

After writing down the answers, a student needs to click on verify answer button to generate his score.

![Verify Test](/assets/images/verify.png)

## Release Information

2022-04-29 1.0.0 released: Learn Tab and Teach Tab.

## Next Steps

1. Developing "Take Test" Tab.
2. Support for more languages.
3. Dynamic Tags/Categories.
4. Authentication

## References

[MUI App bar](https://mui.com/material-ui/react-app-bar/)
[MUI Table](https://mui.com/material-ui/react-table/#main-content)
[MUI Text field](https://mui.com/material-ui/react-text-field/#main-content)
