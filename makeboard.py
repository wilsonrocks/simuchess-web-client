print('<table class="board">')
for chessRank in "87654321":
    print('  <tr class="row">')
    for chessFile in "abcdefgh":
        print('    <td class="square" id="{square}">{square}</td>'.format(square=(chessRank + chessFile)))
    print('  </tr>')
print('</table')