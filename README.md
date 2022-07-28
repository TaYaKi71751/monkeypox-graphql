# Usage

`query{`

  #### # Cumulative
  ```
    cumulative {
      confirmed
      # suspected
      # discarded
      # omit_error
    }
  ```

  #### # Cumulative by Country
  ```
    cumulative (Country:"South Korea") {
      confirmed
      # suspected
      # discarded
      # omit_error
    }
  ```

`}`
