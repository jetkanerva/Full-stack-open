npm install
npm run build

SOURCE_DIR="/dist"
DESTINATION_DIR="../phonebook_backend/dist"

cp -r "$SOURCE_DIR" "$DESTINATION_DIR"