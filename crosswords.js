(function(){

	var cwBoard = function (height, width, words, directions) {

		var
			matrix = [],
			wordsMap = [],
			_this = this
		;		

		var __construct = function() {

			// define directions clockwise
			if(directions == undefined)				
				directions = [0, 1, 2, 3, 4, 5, 6, 7];

			if(words == undefined)
				words = []

			// prepare board
			for(var i=0; i < height; i++) {
				matrix[i] = [];
				for(var j=0; j < width; j++) {
					matrix[i][j] = '';
				}
			}

			// add defined words
			for(var i=0; i < words.length; i++)
				_this.addWord(words[i]);

		}

		this.getWordsMap = function() {
			return wordsMap;
		}

		this.getSize = function() {
			return [height, width];
		}

		var write = function(word, x, y, direction) {
			var
				cursorX = x,
				cursorY = y,
				positions = []
			;

			for(var i=0; i<word.length; i++) {

				var l = word.substr(i, 1);

				// case the cell is filled with another letter and cannot be used
				if(matrix[cursorX][cursorY] != '' && matrix[cursorX][cursorY] != l)
					return false;

				// assign the letter to the cell
				positions.push([cursorX, cursorY, l]);

				// according direction of writing, move the cursor
				switch(direction) {
					case 0: // left to right
						cursorY++;
						break;
					case 1: // left to right descending
						cursorX++;
						cursorY++;
						break;
					case 2: // top to bottom
						cursorX++;
						break;
					case 3: // right to left descending
						cursorX++;
						cursorY--;
						break;
					case 4: // right to left
						cursorY--;
						break;
					case 5: // right to left ascending
						cursorX--;
						cursorY--;
						break;
					case 6: // bottom to top
						cursorX--;
						break;
					case 7: // left to right ascending
						cursorX--;
						cursorY++;
						break;
					end;
				}

				// if cursor goes beyond the board, stop the writing
				if(
						cursorX < 0
					|| cursorY < 0
					|| cursorX >= height
					|| cursorY >= width
				) {
					return false;
				}
			}

			// write the word on the board
			for(var i=0; i<positions.length;i++)
				matrix[positions[i][0]][positions[i][1]] = positions[i][2];

			// add word to the wordsmap
			wordsMap.push([word, positions]);

			return true;
		}

		this.getBoard = function(randomLetters) {
			if(randomLetters == undefined)
				randomLetters = true;

			var m = [];

			for(var i=0; i < height; i++) {
				m[i] = [];
				for(var j=0; j < width; j++) {
					l = matrix[i][j];
					if(randomLetters)
						if(l == '') l = randChar();
					m[i][j] = l
				}
			}

			return m;
		}

		this.toString = function(randomLetters) {
			var
				board = _this.getBoard(randomLetters);
				string = ''
			;

			for(var i=0; i < height; i++) {
				for(var j=0; j < width; j++) {
					l = board[i][j];
					if(l == '') l = ' ';
					string += l;
				}
				string += '\n';
			}

			return string;
		}

		var randChar = function() {
			var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			return letters[Math.floor((Math.random() * (letters.length-1)))];
		}

		this.addWord = function(word) {
			word = word.toUpperCase();
			var
				x = 0,
				y = 0,
				direction = 0
			;

			do {
				x = Math.floor((Math.random() * (height-1)));
				y = Math.floor((Math.random() * (width-1)));				
				direction = directions[Math.floor((Math.random() * directions.length))];				
			} while(!write(word, x, y, direction));
		}

		__construct();
	}


	var cwGame = function(cwBoard) {

		var
			selectedCells = []
		;

		var __construct = function() {
			if(cwBoard == undefined)
				return;

			// clear container
			var board = document.getElementById('board');
			while (board.firstChild)
				board.removeChild(board.firstChild);			

			// create the container
			var size = cwBoard.getSize();
			for(var i=0; i < size[0]; i++) {
				for(var j=0; j < size[1]; j++) {
					var el = document.createElement('div');
					el.setAttribute('class', 'cell' + (j == 0 ? ' clear' : ''));
					el.setAttribute('id', 'cell_' + i + '_' + j);
					el.addEventListener('click', clickCell);
					board.appendChild(el);
				}
			}
		}

		var refreshBoard = function() {
			clearSuccess();
			var wordsMap = cwBoard.getWordsMap();
			for(var i=0; i < wordsMap.length; i++)
				if(isSelectedWord(wordsMap[i][1]))
					successWord(wordsMap[i][1]);
		}

		var isSelectedCoord = function(x, y) {
			for(var i=0; i<selectedCells.length; i++)
				if(selectedCells[i][0] == x && selectedCells[i][1] == y)
					return true;
			return false;
		}

		var successWord = function(coords) {
			for(var i=0; i < coords.length; i++) {
				el = document.getElementById('cell_' + coords[i][0] + '_' + coords[i][1]);
				el.className += ' solved';
			}
		}

		var clearSuccess = function() {
			var size = cwBoard.getSize();
			for(var i=0; i < size[0]; i++) {
				for(var j=0; j < size[1]; j++) {
					var el = document.getElementById('cell_' + i + '_' + j);
					el.className = el.className.replace(' solved', '');
				}
			}			
		}

		var isSelectedWord = function(coords) {
			for(var i=0; i < coords.length; i++)
				if(!isSelectedCoord(coords[i][0], coords[i][1]))
					return false;
			return true;
		}

		var clickCell = function(e) {
			var el = e.srcElement;
			var parseCoords = function(strParameter) {
				strParameter = strParameter.replace('cell_', '');
				return strParameter.split('_').map(function(e){
					return parseInt(e);
				});
			}
			var coords = parseCoords(el.getAttribute('id'));

			// if already selected
			if(el.className.indexOf(' selected') > 0) {
				el.className = el.className.replace(' selected', '');
				for(var i=0; i<selectedCells.length; i++)
					if(selectedCells[i][0] == coords[0] && selectedCells[i][1] == coords[1])
						selectedCells.splice(i, 1);
			}

			// if not selected
			else {
				el.className += ' selected';
				selectedCells.push(coords);
			}

			refreshBoard();
		}

		this.start = function() {
			var
				board = cwBoard.getBoard(),
				size = cwBoard.getSize()
			;

			for(var i=0; i < size[0]; i++) {
				for(var j=0; j < size[1]; j++) {
					var el = document.getElementById('cell_' + i + '_' + j);
					if(el != undefined)
						el.innerHTML = board[i][j];
				}
			}

			console.log(cwBoard.toString(false));
		}

		__construct();
	}

	window.addEventListener('load', function(){
		document.getElementById('btnRun').addEventListener('click', function(){

			var lines = document.getElementById('lines').value;
			var columns = document.getElementById('columns').value;
			var words = document.getElementById('words').value.split(' ');			

			var board = new cwBoard(lines, columns, words);
			var draw = new cwGame(board);
			draw.start();

		});
	});

})();