# solitaire
import requests
import hashlib

def get_checksum(score, play_time, url):
    game_state_data = ""
    str2hash = (
        f"{score}:{play_time}:{url}:{game_state_data}:"
        "crmjbjm3lczhlgnek9uaxz2l9svlfjw14npauhen"
    )
    result = hashlib.md5(str2hash.encode())
    checksum = result.hexdigest()
    return checksum

# Новое значение счета
new_score = 7180

# Время игры
play_time = 28

# URL игры
game_url = "/game-bot/piratesolitaire-907619a3b17c0670857535dbac4dc41b55b0256a"
           

# Генерация контрольной суммы
checksum = get_checksum(new_score, play_time, game_url)

# URL эндпоинта API
api_endpoint = "https://api.service.gameeapp.com/"

# Токен доступа
access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOiIxNzA5ODAzNTg1IiwidXNlcklkIjoyMTYwMTk0MSwiaW5zdGFsbFV1aWQiOiJkNzlmNTFjOS1jOGNmLTQxMjctYjBiMi0yMzVjZTNiMzRmMjAiLCJ0eXBlIjoiYXV0aGVudGljYXRpb25Ub2tlbiIsImF1dGhvcml6YXRpb25MZXZlbCI6ImJvdCIsInBsYXRmb3JtIjoiYm90LXRlbGVncmFtIn0.OJDPKjDao9Q4YmId24CP_0chqte3FzmRAq2dPnc7kdQ'"

# Заголовок авторизации
headers = {
    "Authorization": f"Bearer {access_token}"
}

# Запрос на изменение счета
response = requests.post(api_endpoint, json={
    "id": "game.saveWebGameplay",
    "jsonrpc": "2.0",
    "method": "game.saveWebGameplay",
    "params": {
        "gameplayData": {
            "checksum": checksum,
            "createdTime": "2024-05-04T09:02:11+00:00",
            "gameId": 269,
            "gameplayOrigin": "game",
            "gameStateData": None,
            "gameUrl": game_url,
            "isSaveState": False,
            "metadata": {"gameplayId": 20},
            "playTime": play_time,
            "releaseNumber": 2,
            "replayData": None,
            "replayDataChecksum": None,
            "replayVariant": None,
            "score": new_score}}},    headers = headers  # Подставляем заголовок авторизации
)

# Вывод результата запроса
print(response.text)