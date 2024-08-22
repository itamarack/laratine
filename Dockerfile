# Base Image
FROM ubuntu:22.04

LABEL maintainer="Your Name <your.email@example.com>"

# Arguments and Environment Variables
ARG WWWUSER=1000
ARG NODE_VERSION=20
ARG MYSQL_CLIENT="mysql-client"
ARG POSTGRES_VERSION=15
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

WORKDIR /var/www/html

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install system dependencies
RUN apt-get update \
    && apt-get install -y gnupg gosu curl ca-certificates zip unzip git supervisor sqlite3 \
       libpng-dev python2 dnsutils librsvg2-bin ffmpeg nano nginx \
    && apt-get install -y php8.3-cli php8.3-fpm php8.3-pgsql php8.3-sqlite3 php8.3-gd \
       php8.3-curl php8.3-imap php8.3-mysql php8.3-mbstring php8.3-xml php8.3-zip \
       php8.3-bcmath php8.3-soap php8.3-intl php8.3-readline php8.3-ldap \
       php8.3-msgpack php8.3-igbinary php8.3-redis php8.3-swoole php8.3-memcached \
       php8.3-pcov php8.3-imagick php8.3-xdebug \
    && curl -sLS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer \
    && apt-get install -y nodejs yarn $MYSQL_CLIENT postgresql-client-$POSTGRES_VERSION \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Create system user
RUN groupadd --force -g $WWWUSER sail \
    && useradd -ms /bin/bash --no-user-group -g $WWWUSER -u 1337 sail

# Configure PHP-FPM
RUN sed -i "s/user = www-data/user = sail/" /etc/php/8.3/fpm/pool.d/www.conf \
    && sed -i "s/group = www-data/group = sail/" /etc/php/8.3/fpm/pool.d/www.conf \
    && sed -i "s/listen\.owner.*/listen.owner = sail/" /etc/php/8.3/fpm/pool.d/www.conf \
    && sed -i "s/listen\.group.*/listen.group = sail/" /etc/php/8.3/fpm/pool.d/www.conf \
    && sed -i "s/;listen\.mode.*/listen.mode = 0660/" /etc/php/8.3/fpm/pool.d/www.conf

# Copy application code
COPY . /var/www/html

# Set permissions
RUN chown -R sail:sail /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80

# Start script
COPY start-container /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

# Run start-container script
ENTRYPOINT ["start-container"]
