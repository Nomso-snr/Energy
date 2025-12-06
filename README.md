Decimal → Binary Converter

Files
- `energy.html` — main UI (open in a browser)
- `energy.css` — styles (dark mode by default)
- `script.js` — conversion logic and UI bindings

Usage
1. Open `energy.html` in your browser (double-click the file or open with your browser).
2. Enter a decimal number in the input. Examples: `12.625`, `-3.2`, `.5`.
3. The binary equivalent appears automatically as you type. Fractional binary that repeats will show the repeating bits in parentheses.
4. Use the `Copy` and `Download .txt` buttons to copy or save the result.

Notes
- The converter uses a default fractional precision of 32 bits.
- You can change the default precision by editing the `precision` constant inside `script.js` if needed.

Want changes?
- I can add a light/dark toggle, a precision control, or unit tests for the conversion function. Tell me which and I will implement it.