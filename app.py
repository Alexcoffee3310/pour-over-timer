from flask import Flask, render_template, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app first
app = Flask(__name__)

# Then add request logger
@app.before_request
def log_request_info():
    logger.info(f"Request from {request.remote_addr} for {request.method} {request.path}")
    logger.debug(f"User-Agent: {request.headers.get('User-Agent')}")
    logger.debug(f"DNS Info - Host: {request.host}")

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://loftnbean.com",
            "https://loftnbean.com",
            "http://www.loftnbean.com",
            "https://www.loftnbean.com",
            "http://localhost:8080",  # Add development domain
            "http://127.0.0.1:8080"   # Add local IP
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type"]
    }
})

# Use environment variables for configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///recipes.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    stages = db.Column(db.Text, nullable=False)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return send_file('index.html')

# Add error handlers
@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify(error=str(e)), 405

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify(error="Internal server error"), 500

@app.route('/api/recipes', methods=['GET', 'POST', 'OPTIONS'])
def recipes():
    logger.info(f"Received {request.method} request to /api/recipes")
    logger.debug(f"Request headers: {request.headers}")
    logger.debug(f"Request data: {request.get_data()}")
    
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return '', 204

    if request.method == 'GET':
        try:
            recipes = Recipe.query.all()
            return jsonify([
                {'id': recipe.id, 'name': recipe.name, 'stages': recipe.stages}
                for recipe in recipes
            ])
        except Exception as e:
            logger.error(f"Error fetching recipes: {e}")
            return jsonify({'error': 'Internal server error'}), 500

    elif request.method == 'POST':
        try:
            if not request.is_json:
                return jsonify({'error': 'Content type must be application/json'}), 415
                
            data = request.get_json()
            if not data or 'name' not in data or 'stages' not in data:
                return jsonify({'error': 'Invalid recipe data'}), 400
            
            stages_json = json.dumps(data['stages'])
            new_recipe = Recipe(name=data['name'], stages=stages_json)
            db.session.add(new_recipe)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'id': new_recipe.id,
                'name': new_recipe.name,
                'stages': new_recipe.stages
            }), 201
            
        except Exception as e:
            logger.error(f"Error saving recipe: {e}")
            db.session.rollback()
            return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/recipes/<int:recipe_id>', methods=['GET', 'PUT', 'DELETE'])
def recipe_operations(recipe_id):
    logger.info(f"Handling {request.method} request for recipe {recipe_id}")
    
    try:
        recipe = Recipe.query.get_or_404(recipe_id)
    except Exception as e:
        logger.error(f"Recipe {recipe_id} not found: {e}")
        return jsonify({
            'error': 'Not found',
            'message': f'Recipe with id {recipe_id} does not exist'
        }), 404
    
    if request.method == 'GET':
        logger.info(f"Fetching recipe {recipe_id}")
        return jsonify({
            'id': recipe.id,
            'name': recipe.name,
            'stages': recipe.stages
        })
    
    elif request.method == 'PUT':
        try:
            logger.info(f"Updating recipe {recipe_id}")
            logger.debug(f"Request data: {request.get_data()}")
            
            if not request.is_json:
                return jsonify({'error': 'Content type must be application/json'}), 415
                
            data = request.get_json()
            if not data or 'name' not in data or 'stages' not in data:
                return jsonify({'error': 'Invalid recipe data'}), 400
            
            recipe.name = data['name']
            recipe.stages = json.dumps(data['stages'])
            db.session.commit()
            
            logger.info(f"Successfully updated recipe {recipe_id}")
            return jsonify({
                'success': True,
                'id': recipe.id,
                'name': recipe.name,
                'stages': recipe.stages
            })
            
        except Exception as e:
            logger.error(f"Error updating recipe {recipe_id}: {e}")
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(recipe)
            db.session.commit()
            return jsonify({'message': 'Recipe deleted successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@app.route('/server-info')
def server_info():
    server_software = request.environ.get('SERVER_SOFTWARE', 'Unknown')
    return jsonify({
        'server': server_software,
        'headers': dict(request.headers)
    })

@app.route('/api/test', methods=['GET'])
def test_api():
    return jsonify({
        'status': 'ok',
        'message': 'API is working'
    })

if __name__ == '__main__':
    # Development settings
    app.config.update(
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Lax',
        PERMANENT_SESSION_LIFETIME=1800  # 30 minutes
    )
    
    port = int(os.environ.get('PORT', 8000))  # Changed from 8080 to 8000
    app.run(
        host='0.0.0.0',
        port=port,
        threaded=True,
        debug=False
    )
