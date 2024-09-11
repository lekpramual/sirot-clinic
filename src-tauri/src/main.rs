// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use mysql::*;
// use mysql::prelude::*;
use mysql::*;
use mysql::prelude::*;
use tauri::command;

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


// #[command]
// async fn read_user_id(user_id: u32) -> Result<Option<User>, String> {

//     let pool = connect_to_mysql().await?;
//     let mut conn = match pool.get_conn() {
//         Ok(conn) => conn,
//         Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
//     };


//     // TODO
//     let user: Option<User> = match conn.exec_first(
//       "SELECT user_id, user_code, CONCAT(user_title,user_fname,' ',user_lname) AS user_fullname,user_position,user_status FROM users WHERE user_id = :id",
//       params!{"id" => user_id}
//     ){
//         Ok(user) => user,
//         Err(err) => return Err(format!("Failed to execute query: {}", err)),
//     };

//     Ok(user)
// }

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

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![read_users,read_user_id])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
