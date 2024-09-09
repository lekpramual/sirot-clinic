// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use mysql::*;
use mysql::prelude::*;
use tauri::command;

// Define a struct to hold the query result.
#[derive(Debug, serde::Serialize)]
struct User {
    user_id: u32,
    user_code: String,
}

#[command]
async fn connect_to_mysql() -> Result<Vec<User>, String> {
    let database_url = "mysql://root:abc123==@localhost:3306/clinic_db";

    let pool = match Pool::new(database_url) {
        Ok(pool) => pool,
        Err(err) => return Err(format!("Failed to create database pool: {}", err)),
    };

    let mut conn = match pool.get_conn() {
        Ok(conn) => conn,
        Err(err) => return Err(format!("Failed to connect to the database: {}", err)),
    };

    // Perform a query or any other action with the connection
    // match conn.query_drop("SELECT 1") {
    //     Ok(_) => Ok("Connection successful!".to_string()),
    //     Err(err) => Err(format!("Query failed: {}", err)),
    // }

    // Perform a SELECT query.
    let users: Vec<User> = match conn.query_map(
      "SELECT user_id, user_code FROM users",
      |(user_id, user_code)| User { user_id, user_code },
  ) {
      Ok(users) => users,
      Err(err) => return Err(format!("Failed to execute query: {}", err)),
  };

  Ok(users)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![connect_to_mysql])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
