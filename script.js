// Decimal to Binary converter with fractional support and repeating detection
(function(){
	const input = document.getElementById('decimalInput');
	const convertBtn = document.getElementById('convertBtn');
	const clearBtn = document.getElementById('clearBtn');
	const output = document.getElementById('binaryOutput');
	const copyBtn = document.getElementById('copyBtn');
	const downloadBtn = document.getElementById('downloadBtn');
	// removed UI options: auto-convert and precision (handled as defaults)
	const autoConvert = null;
	const precisionSelect = null;

	function decimalToBinary(str, maxFractionBits){
		if(typeof str !== 'string') str = String(str);
		str = str.trim();
		if(str === '') return '';

		// Accept numbers like .5 or -.25
		if(str === '.' || str === '-' || str === '+') return 'Invalid input';

		const n = Number(str);
		if(!isFinite(n)) return 'Invalid number';

		const sign = n < 0 ? '-' : '';
		const abs = Math.abs(n);

		const parts = str.replace(/^[+-]/,'').split('.');
		const intPart = Math.floor(abs);
		const fracDecimal = abs - intPart;

		// Integer binary using built-in for correctness and speed
		const integerBinary = intPart === 0 ? '0' : intPart.toString(2);

		if(fracDecimal === 0) return sign + integerBinary;

		// Fractional part: repeated-detection using map of seen fractions (rounded key)
		let frac = fracDecimal;
		const seen = new Map();
		let fracBits = '';
		let repeatingStart = -1;
		const eps = 1e-15;

		for(let i=0;i<maxFractionBits;i++){
			const key = frac.toFixed(15);
			if(seen.has(key)){
				repeatingStart = seen.get(key);
				break;
			}
			seen.set(key, i);

			frac *= 2;
			if(frac + eps >= 1){
				fracBits += '1';
				frac -= 1;
			} else {
				fracBits += '0';
			}

			if(Math.abs(frac) < eps) { // finished exactly
				break;
			}
		}

		let fracDisplay = fracBits;
		if(repeatingStart >= 0){
			fracDisplay = fracBits.slice(0,repeatingStart) + '(' + fracBits.slice(repeatingStart) + ')';
		}

		return sign + integerBinary + '.' + fracDisplay;
	}

	function doConvert(){
		const val = input.value;
		const precision = 32; // fixed precision now, since precision control removed
		const result = decimalToBinary(val, precision);
		output.value = result;
	}

	convertBtn.addEventListener('click', doConvert);
	clearBtn.addEventListener('click', ()=>{input.value=''; output.value=''; input.focus();});

	input.addEventListener('keydown', (e)=>{
		if(e.key === 'Enter'){ doConvert(); e.preventDefault(); }
	});

	// keep auto-convert behaviour: convert as you type
	input.addEventListener('input', ()=>{ doConvert(); });

	copyBtn.addEventListener('click', async ()=>{
		try{
			await navigator.clipboard.writeText(output.value);
			copyBtn.textContent = 'Copied';
			setTimeout(()=>copyBtn.textContent='Copy',1200);
		}catch(e){
			console.error('Copy failed', e);
		}
	});

	downloadBtn.addEventListener('click', ()=>{
		const blob = new Blob([output.value],{type:'text/plain;charset=utf-8'});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url; a.download = 'binary.txt'; document.body.appendChild(a); a.click(); a.remove();
		URL.revokeObjectURL(url);
	});

	// initial example
	if(input.value.trim() === ''){
		input.value = '12.625';
	}
	doConvert();

})();

