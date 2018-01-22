"""
A simple script to generate the HTML board for the simuchess game web client.
"""

seed = ["white-square", "black-square"]
odd_row = seed * 4
even_row = odd_row[-1::-1]
two_rows = odd_row + even_row
board = iter(two_rows * 4)

print('<div class="board">')
for chessRank in "87654321":
    for chessFile in "abcdefgh":
        print('    <div class="square {colour}" id="{square}"></div>'.format(colour=next(board), square=(chessFile + chessRank)))
print('</div>')
