import json
from flask import Flask, request
from copy import deepcopy

shortestPath = 100000
app = Flask(__name__)


@app.route("/checkResult/", methods=['POST'])
def output():
    print(request.json)
    return returnMatrixes(request.json)


def findPaths(grid, player, playerVector):
    # for i in grid:
    #    print(i)
    start = player
    path = [start]
    allPaths = []
    visited = set()
    global shortestPath

    def rec(start, path, visited, grid, allPaths, player, playerVector):
        x = start[0]
        y = start[1]
        global shortestPath

        if len(allPaths) > 0:
            if len(path) > shortestPath:
                return

        if grid[y][x] == "2":
            allPaths.append(path[:])
            return

        visited.add((x, y))
        if (x, y) == player:
            x2, y2 = x + playerVector[0], y + playerVector[1]
            path.append((x2, y2))
            rec((x2, y2), path, visited, grid, allPaths, player, playerVector)
            path.pop()
        else:
            for x2, y2 in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= x2 < len(grid[1]) and 0 <= y2 < len(grid) and (grid[y2][x2] == "0" or grid[y2][x2] == "2") and (
                x2, y2) not in visited:
                    path.append((x2, y2))
                    rec((x2, y2), path, visited, grid, allPaths, player, playerVector)
                    path.pop()
        visited.remove((x, y))

    rec(start, path, visited, grid, allPaths, player, playerVector)

    allPaths.sort(key=lambda x: len(x))
    minLen = len(allPaths[0])
    finArr = []

    for p in allPaths:
        finArr.append(p)

    return finArr


def findLeastArrows(playerVector, paths, mat):
    allMatrixes = []
    numArrows = 0
    actualVector = playerVector
    newVector = (0, 0)

    for path in paths:
        newMat = deepcopy(mat)
        for i in range(len(path) - 1):
            newX = path[i + 1][0] - path[i][0]
            newY = path[i + 1][1] - path[i][1]
            newVector = (newX, newY)
            if newMat[path[i][1]][path[i][0]] in "pDpLpRpU":
                pass
            elif newVector == actualVector:
                newMat[path[i][1]][path[i][0]] = mat[path[i][1]][path[i][0]]
            elif newVector == (-1, 0):
                newMat[path[i][1]][path[i][0]] = "a"
            elif newVector == (1, 0):
                newMat[path[i][1]][path[i][0]] = "d"
            elif newVector == (0, -1):
                newMat[path[i][1]][path[i][0]] = "w"
            elif newVector == (0, 1):
                newMat[path[i][1]][path[i][0]] = "s"
            actualVector = newVector

        allMatrixes.append(deepcopy(newMat))

    minArrows = 10000
    arrowCount = 0
    finalMatrixes = []

    for m in allMatrixes:
        for y in range(len(m)):
            for x in range(len(m[y])):
                if m[y][x] == "a":
                    if (y + 1) >= len(m):
                        m[y][x] = "0"
                    elif m[y + 1][x] == "1":
                        m[y][x] = "0"
                elif m[y][x] == "d":
                    if (y - 1) < 0:
                        m[y][x] = "0"
                    elif m[y - 1][x] == "1":
                        m[y][x] = "0"

                elif m[y][x] == "s":
                    if (x + 1) >= len(m[y]):
                        m[y][x] = "0"
                    elif m[y][x + 1] == "1":
                        m[y][x] = "0"
                elif m[y][x] == "w":
                    if (x - 1) < 0:
                        m[y][x] = "0"
                    elif m[y][x - 1] == "1":
                        m[y][x] = "0"

    for m in allMatrixes:
        arrowCount = 0
        for y in range(len(m)):
            for x in range(len(m[y])):
                if m[y][x] == "a" or m[y][x] == "d" or m[y][x] == "s" or m[y][x] == "w":
                    arrowCount += 1

        if minArrows >= arrowCount:
            minArrows = arrowCount
            finalMatrixes.append(m)

    totalFinalMatrixes = []
    for m in allMatrixes:
        arrowCount = 0
        for y in range(len(m)):
            for x in range(len(m[y])):
                if m[y][x] == "a" or m[y][x] == "d" or m[y][x] == "s" or m[y][x] == "w":
                    arrowCount += 1

        if minArrows == arrowCount:
            totalFinalMatrixes.append(m)

    return (totalFinalMatrixes, minArrows)


def findPlayerVector(matrix):
    for y in range(len(matrix)):
        for x in range(len(matrix[y])):
            if matrix[y][x] == "pL":
                return (-1, 0)
            elif matrix[y][x] == "pR":
                return (1, 0)
            elif matrix[y][x] == "pU":
                return (0, -1)
            elif matrix[y][x] == "pD":
                return (0, 1)


def findPlayer(matrix):
    for y in range(len(matrix)):
        for x in range(len(matrix[y])):
            if matrix[y][x] == "pL":
                return (x, y)
            elif matrix[y][x] == "pR":
                return (x, y)
            elif matrix[y][x] == "pU":
                return (x, y)
            elif matrix[y][x] == "pD":
                return (x, y)


def findFinish(matrix):
    found = False
    for y in range(len(matrix)):
        for x in range(len(matrix[y])):
            if matrix[y][x] == "2":
                found = True
    return found


def clearMatrix(matrix):
    mat = matrix
    for y in range(len(matrix)):
        for x in range(len(matrix[y])):
            if matrix[y][x] == "w" or matrix[y][x] == "a" or matrix[y][x] == "s" or matrix[y][x] == "d":
                matrix[y][x] = "0"
    return mat


def clearMatrixFin(matrix):
    mat = matrix
    for y in range(len(matrix)):
        for x in range(len(matrix[y])):
            if matrix[y][x] == "pU" or matrix[y][x] == "pD" or matrix[y][x] == "pL" or matrix[y][x] == "pR" or \
                    matrix[y][x] == "2":
                matrix[y][x] = "0"
    return mat


def returnMatrixes(data):
    items = data
    board = items["board"]
    playerDirection = items["playerDirection"]
    playerCoords = items["playerCoords"]
    finishCoords = items["finishCoords"]

    pd = ""
    if playerDirection == "w":
        pd = "pU"
    elif playerDirection == "s":
        pd = "pD"
    elif playerDirection == "a":
        pd = "pL"
    elif playerDirection == "d":
        pd = "pR"

    pX = playerCoords[0]
    pY = playerCoords[1]

    fX = finishCoords[0]
    fY = finishCoords[1]
    board[fY][fX] = "2"
    while True:
        if pd == "pU" and board[pY - 1][pX] == "1":
            pd = "pR"
        elif pd == "pD" and board[pY + 1][pX] == "1":
            pd = "pL"
        elif pd == "pL" and board[pY][pX - 1] == "1":
            pd = "pU"
        elif pd == "pR" and board[pY][pX + 1] == "1":
            pd = "pD"
        else:
            break

    board[playerCoords[1]][playerCoords[0]] = pd
    playerVector = findPlayerVector(board)
    player = findPlayer(board)

    finish = findFinish(board)
    if finish == False:
        return {"minArrows": 0, "board": []}
    board = clearMatrix(board)

    paths = findPaths(board, player, playerVector)
    result = findLeastArrows(playerVector, paths, board)

    # for i in result[0]:
    #    for x in i:
    #        print(x)

    finalMatrixes = []
    for i in result[0]:
        tempMat = clearMatrixFin(i)
        finalMatrixes.append(tempMat)

    # for i in finalMatrixes:
    #    for x in i:
    #        print(x)
    ret = {"minArrows": result[1], "board": finalMatrixes}
    sendValue = json.dumps(ret)
    return sendValue

if __name__ == '__main__':
    app.run(port=4996)
