FROM mcr.microsoft.com/playwright:v1.54.1-jammy

WORKDIR /app

COPY package.json ./
RUN apt update && apt install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs && \
    npm install

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "node server.js & node worker.js && wait"]
