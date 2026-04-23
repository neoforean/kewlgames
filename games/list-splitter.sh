#!/usr/bin/env bash

INPUT_FILE="list"
LINES_PER_FILE=45
OUTPUT_PREFIX="page"

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "'$INPUT_FILE' not found"
  exit 1
fi

awk -v lines="$LINES_PER_FILE" -v prefix="$OUTPUT_PREFIX" '
{
  file = prefix int((NR-1)/lines) + 1
  print > file
  max_file = file
}
END {
  # extract number from page string
  gsub(/[^0-9]/, "", max_file)
  print max_file > "count"
}
' "$INPUT_FILE"