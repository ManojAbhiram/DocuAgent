.PHONY: install run test lint clean

install:
	python3 -m venv venv
	./venv/bin/pip install -r requirements.txt

run:
	./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	./venv/bin/pytest -v

lint:
	./venv/bin/flake8 app/
	./venv/bin/black app/
	./venv/bin/mypy app/

clean:
	rm -rf __pycache__ .pytest_cache
	find . -type d -name __pycache__ -exec rm -r {} +
