"""
A simple script to generate the HTML board for the simuchess game web client.
"""
print('<table class="board">')
print('  <tr>')
print('    <th scope="column"></th>')
for chessFile in "abcdefgh":
    print('    <th scope="column">{}</th>'.format(chessFile))
print('  </tr>')
for chessRank in "87654321":
    print('  <tr class="row">')
    print('    <th scope="row">{}</th>'.format(chessRank))
    for chessFile in "abcdefgh":
        print('    <td class="square" id="{square}"></td>'.format(square=(chessFile + chessRank)))
    print('  </tr>')
print('</table>')
