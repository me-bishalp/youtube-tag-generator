import random
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/generate_tags', methods=['POST'])
def generate_tags():
    data = request.get_json()
    # Validate input
    if not all(key in data for key in ('topics', 'keywords', 'amount', 'removeDuplicateTags')):
        return jsonify({"error": "All fields are required"}), 400
    if not all(isinstance(i, str) for i in data['topics']) or not all(isinstance(i, str) for i in data['keywords']):
        return jsonify({"error": "topics and keywords should be a list of strings"}), 400
    if not isinstance(data['amount'], int) or data['amount'] < 1:
        return jsonify({"error": "amount must be an integer greater than 0"}), 400
    if data['removeDuplicateTags'] not in ['yes', 'no']:
        return jsonify({"error": "removeDuplicateTags should be 'yes' or 'no'"}), 400
    topics = data['topics']
    keywords = data['keywords']
    amount = data['amount']
    remove_duplicate_tags = data['removeDuplicateTags']
    if len(topics) == 0 or len(keywords) == 0:
        return jsonify({"error": "topics or keywords should not be empty"}), 400
    if amount > len(keywords) or amount > len(topics):
        return jsonify({"error": "amount should be less than or equal to number of topics or keywords"}), 400
    # Your Python code here
    def generateKeyword(amount):
        return_table = []
        for i in range(amount):
            return_table.append(random.sample(keywords, 1)[0])
        return ' '.join(return_table)

    def generateTopic(): 
        return random.choice(topics)

    def generateTag(): 
        return f'{generateTopic()} {generateKeyword(1)}'

    def generateHashtag():
        ok = f'#{generateTopic()}{generateKeyword(1)}'
        ok = ''.join([i for i in ok if i != ' '])
        return ok

    all_tags = []
    for i in range(amount):
        all_tags.append(generateHashtag())
    if remove_duplicate_tags == "yes":
        all_tags = list(set(all_tags))
    return jsonify(all_tags)

if __name__ == '__main__':
    app.run(debug=True)
