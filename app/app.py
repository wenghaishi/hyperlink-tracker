import sys
import json
import sqlite3

DATABASE = 'hyperlinks.db'

def create_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS hyperlinks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def insert_hyperlink(url):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO hyperlinks (url) VALUES (?)', (url,))
    conn.commit()
    conn.close()

def process_message(message):
    url = message.get('url')
    if url:
        insert_hyperlink(url)

    # Prepare the response message
    response = {
        'result': 'success',
        'data': 'Hyperlink stored in the database'
    }

    # Send the response message back to the Chrome extension
    sys.stdout.write(json.dumps(response))
    sys.stdout.flush()

# Main loop to read messages from standard input and process them
while True:
    # Read the message length (4 bytes, big-endian)
    raw_length = sys.stdin.read(4)
    if len(raw_length) == 0:
        break

    # Convert the message length from bytes to integer
    message_length = int.from_bytes(raw_length.encode(), byteorder='big')

    # Read the message content
    message_content = sys.stdin.read(message_length)
    if len(message_content) == 0:
        break

    # Process the message
    process_message(json.loads(message_content))
