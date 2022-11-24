from crypt import methods
from unicodedata import name
from urllib import request, response
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from numpy import NaN
import math

api = Flask(__name__)
CORS(api, resources={r"*": {"origins": "*"}})

mae = 4773049.266692509
predict = pd.read_csv('../asset/predictions_lowercase.csv')
df = pd.DataFrame(predict)

def searchStats(a):
  for i in range(0,len(df)):
    if df['Player'][i] == a:
      return i
  return False

def isWasteBool(a):
  i = searchStats(a)
  for y in df['Predicted'].index:
    if y == i:
      if abs(abs(float(df['Salary'][i])) - abs(float(df['Predicted'][i]))) < mae:
        return "justify"
      if float(df['Salary'][i]) - float(df['Predicted'][i]) > 0:
        return True
      else:
        return False

@api.route('/name', methods=['POST'])
def retrieve_data():
    data = request.get_json()
    if data is None:
        return jsonify('There is no data to process'), 400
    name = data['name']
    if (searchStats(name) == False):
      return jsonify('Cannot find'), 200
    index = searchStats(name)
    if (isWasteBool(name) == "justify"):
      return jsonify({'info': 'Justify', 'salary': df['Salary'][index], 'predict':df['Predicted'][index].round()}), 200
    elif (isWasteBool(name)):
        return jsonify({'info': 'Waste', 'salary': df['Salary'][index], 'predict':df['Predicted'][index].round()}), 200
    else:
        return jsonify({'info': 'Stonk', 'salary': df['Salary'][index], 'predict':df['Predicted'][index].round()}), 200
