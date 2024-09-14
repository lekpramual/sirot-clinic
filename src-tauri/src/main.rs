// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use mysql::*;
// use mysql::prelude::*;

use mysql::*;
use mysql::prelude::*;
use tauri::command;
use md5;


// Define a struct to hold the query result.
// #[derive(Debug, serde::{Serialize,Deserialize})]
#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct User {
    user_id: u32,
    user_code: String,
    user_fullname: String,
    user_position:String,
    user_status:String
}

#[derive(Debug, serde::Serialize, serde::Deserialize, FromRow)]
struct UserByID {
    user_id: u32,
    user_code: String,
    user_title:String,
    user_fname:String,
    user_lname:String,
    user_position:String,
    user_status:String,
    user_username:String
}


// type user_code = String;

#[command]
async fn create_and_update_item(
  user_title:String,
  user_fname:String,
  user_lname:String,
  user_position:String,
  user_username:String,
  user_password:String
) -> Result<String, String> {

    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };

    // Create an MD5 hash of the password
    let hash = md5::compute(user_password);
    // Convert the hash to a hex string and return it
    let _hashPassword = format!("{:x}", hash);

    let _user = match conn.exec_drop(
        "INSERT INTO users (user_title, user_fname, user_lname,user_position,user_username,user_password, user_created, user_updated)
         VALUES (:user_title, :user_fname, :user_lname, :user_position, :user_username, :user_password , NOW(), NOW())",
        params! {
            "user_title" => user_title,
            "user_fname" => user_fname,
            "user_lname" => user_lname,
            "user_position" => user_position,
            "user_username" => user_username,
            "user_password" => _hashPassword
        }
    ){
        Ok(_user) => _user,
        Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };



    // Retrieve the last inserted ID
    let last_id = conn.last_insert_id();

    let slip_number = format!("{:04}", last_id);
    let _slip_number = "EMP-".to_owned()+&slip_number;
    let userUpdate = match  conn.exec_drop(
      "UPDATE users SET user_code = :user_code WHERE user_id = :id",
        params! {
            "user_code" => _slip_number,
            "id" => last_id,
        }
    ){
      Ok(userUpdate) => userUpdate,
      Err(err) => return Err(format!("Failed to execute update query: {}", err)),
  };

    println!("Last insert ID: {}", last_id);
     // Return the ID of the inserted and updated item
    Ok("ok".to_string())
}

#[command]
async fn connect_to_mysql() -> Result<Pool, String> {
    let database_url = "mysql://root:abc123==@localhost:3306/clinic_db";

    let pool = match Pool::new(database_url) {
        Ok(pool) => pool,
        Err(err) => return Err(format!("Failed to create database pool: {}", err)),
    };



    // let mut conn = match pool.get_conn() {
    //     Ok(conn) => conn,
    //     Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    // };


    // match conn.query_drop("SELECT 1") {
    //     Ok(_) => Ok("Connection successful!".to_string()),
    //     Err(err) => Err(format!("Query failed: {}", err)),
    // }

    Ok(pool)
}

#[command]
async fn read_users() -> Result<Vec<User>, String> {
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };


    // Perform a SELECT query.
    let users: Vec<User> = match conn.query_map(
      "SELECT user_id, user_code, CONCAT(user_title,user_fname,' ',user_lname) AS user_fullname,user_position,user_status FROM users",
      |(user_id, user_code, user_fullname, user_position,user_status)| User { user_id, user_code, user_fullname, user_position,user_status },
    ) {
        Ok(users) => users,
        Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };

    Ok(users)
}


#[command]
async fn read_user_id(user_id: u32) -> Result<Option<UserByID>,String> {
  // println!("User ID: {}", user_id);
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
              Ok(conn) => conn,
              Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
          };

    let user: Option<UserByID> = match conn.exec_first(
        "SELECT user_id,user_code,user_title,user_fname,user_lname,user_position,user_status,user_username FROM users WHERE user_id = :user_id",
        params! {
            "user_id" => user_id,
        }
    ){
              Ok(user) => user,
              Err(err) => return Err(format!("Failed to execute query: {}", err)),
          };

    Ok(user)
}

#[command]
async fn update_user_id(
  user_id:u32,
  user_title:String,
  user_fname:String,
  user_lname:String,
  user_position:String,
  user_username:String,
  user_password:String
) -> Result<String, String> {

    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };

    if(user_password != ""){
       // Create an MD5 hash of the password
      let hash = md5::compute(user_password);
      // Convert the hash to a hex string and return it
      let _hashPassword = format!("{:x}", hash);

      let userUpdate = match  conn.exec_drop(
        "UPDATE users SET
          user_title = :user_title,
          user_fname = :user_fname,
          user_lname = :user_lname,
          user_position = :user_position,
          user_username = :user_username,
          user_password = :user_password,
          user_updated = NOW()
          WHERE user_id = :user_id",
          params! {
            "user_title" => user_title,
            "user_fname" => user_fname,
            "user_lname" => user_lname,
            "user_position" => user_position,
            "user_username" => user_username,
            "user_password" => _hashPassword,
            "user_id" => user_id
          }
      ){
        Ok(userUpdate) => userUpdate,
        Err(err) => return Err(format!("Failed to execute update query: {}", err)),
      };
    }else{
      let userUpdate = match  conn.exec_drop(
        "UPDATE users SET
          user_title = :user_title,
          user_fname = :user_fname,
          user_lname = :user_lname,
          user_position = :user_position,
          user_username = :user_username,
          user_updated = NOW()
          WHERE user_id = :user_id",
          params! {
            "user_title" => user_title,
            "user_fname" => user_fname,
            "user_lname" => user_lname,
            "user_position" => user_position,
            "user_username" => user_username,
            "user_id" => user_id
          }
      ){
        Ok(userUpdate) => userUpdate,
        Err(err) => return Err(format!("Failed to execute update query: {}", err)),
      };
    }



    // println!("Last insert ID: {}", user_id);
     // Return the ID of the inserted and updated item
    Ok("ok".to_string())
}

#[command]
async fn login_user(user_username: String, user_password: String) -> Result<String,String> {
  // println!("User ID: {}", user_id);
    let pool = connect_to_mysql().await?;
    let mut conn = match pool.get_conn() {
              Ok(conn) => conn,
              Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
          };

     // Create an MD5 hash of the password
     let hash = md5::compute(user_password);
     // Convert the hash to a hex string and return it
     let _hashPassword = format!("{:x}", hash);

    let user: Option<(u32, String, String)> = match conn.exec_first(
        "SELECT user_id,user_username,user_password FROM users WHERE user_username = :user_username  AND user_password = :user_password AND user_status ='active' ",
        params! {
            "user_username" => user_username,
            "user_password" => _hashPassword
        }
    ){
              Ok(user) => user,
              Err(err) => return Err(format!("Failed to execute query: {}", err)),
    };

    // Check if the user exists
    if let Some((user_id, user_username, user_password)) = user {
      Ok("success".into())
    } else {
        Err("Invalid username or password".into())
    }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      read_users,
      read_user_id,
      create_and_update_item,
      update_user_id,
      login_user
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
