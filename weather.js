//Спрашиваем у пользователя разрешение на получение геопозиции.
document.addEventListener('DOMContentLoaded', function() {
    window.navigator.geolocation.getCurrentPosition (getPositionSuccess, getPositionFail);
});

//Обработка геопозиции в случае согласия -- берем широту и долготу и обрезаем их до значений, которые можно передать в API
function getPositionSuccess(position) {
    var userPosition = [];
    userPosition[0] = position.coords.latitude.toString().slice(0,6);
    userPosition[1] = position.coords.longitude.toString().slice(0,6);
    loadDataByCurrentPosition(userPosition);
};

//Обработка на случай, если не было дано разрешения на геопозицию.
//В шаблоны будут вставлены прочерки вместо данных, а картинка будет дефолтная.
function getPositionFail() {
    var failData = {
        temperature: '--°',
        wind: 'Ветер -- км/ч',
        humidity: 'влажность --%',
        icon: 'http://openweathermap.org/img/w/01d.png'
    };
    dataAppender(failData);
};

//Отсылаем запрос с полученными координатами
function loadDataByCurrentPosition(userPosition) {
    var xhr = new XMLHttpRequest(); 
    var key = '1b0a3b86149d2d24c75ec931fadc5dcf';
    var url = `//api.openweathermap.org/data/2.5/weather?lat=${userPosition[0]}&lon=${userPosition[1]}&units=metric&appid=${key}`;

    xhr.open('GET', url, true);
    xhr.send();

    xhr.onload = loadedDataManager;
};

//Парсим полученный JSON и передаем его в getWeather, где данные приведутся в более удобный вид,
//его и записываем в переменную data
function loadedDataManager(event) {
    var data = getWeather(JSON.parse(event.target.responseText));
    dataAppender(data);    
};

//Приклеиваем в документ элементы
function dataAppender(data) {
    //Шаблонизация строками
    document.querySelector('.string-template').innerHTML = dataStringTemplate(data);

    //Шаблонизация браузером
    document.querySelector('.browser-template').appendChild(dataBrowserTemplate(data));

    //Шаблонизация в два прохода
    document.querySelector('.two-steps-template').appendChild(browserJSEngine(dataJSTemplate(data)));
};

//Шаблонизация строками, формируем элемент
function dataStringTemplate(data) {
    return `
        <main class="weather__main">
            <header class="weather__title">
                <h1>
                    <a href="https://yandex.ru/pogoda/simferopol" class="link link_blue">Погода</a>
                </h1>
            </header>
            <content class="weather__content">
                <a href="https://yandex.ru/pogoda/simferopol" class="link link_black weather__box">
                    <icon class="weather__icon" style="background-image: url(${data.icon})">
                    </icon>
                    <title class="weather__temp">
                        ${data.temperature}
                    </title>
                </a>
                <description class="weather__forecast">
                    <a href="https://yandex.ru/pogoda/simferopol" class="link link_black link_nowrap">${data.wind}</a><span>,</span> 
                    <br>
                    <a  href="https://yandex.ru/pogoda/simferopol" class="link link_black link_nowrap">${data.humidity}</a>
                </description>
            </content>
        </main>
    `;
};

//Шаблонизация браузером, формируем элемент
function dataBrowserTemplate(data) {
    var container = document.createElement('main');
    var widgetHeader = document.createElement('header');
    var widgetName = document.createElement('h1');
    var widgetLink = document.createElement('a');
    var content = document.createElement('content');
    var contentLink = document.createElement('a');
    var weatherIconContainer = document.createElement('icon');
    var weatherTemp = document.createElement('title');
    var weatherDescrip = document.createElement('description');
    var weatherLinkWind = document.createElement('a');
    var weatherLinkHumidity = document.createElement('a');
    var weatherText = document.createElement('span');
    var br = document.createElement('br');
    var widgetLinkTitle = document.createTextNode('Погода');
    var weatherTempValue = document.createTextNode(`${data.temperature}`);
    var weatherWindValue = document.createTextNode(`${data.wind}`);
    var weatherHumidityValue = document.createTextNode(`${data.humidity}`);

    container.classList.add('weather__main');
    widgetHeader.classList.add('weather__title');
    widgetLink.classList.add('link', 'link_blue');
    content.classList.add('weather__content');
    contentLink.classList.add('link', 'link_black', 'weather__box');
    weatherIconContainer.classList.add('weather__icon');
    weatherTemp.classList.add('weather__temp');
    weatherDescrip.classList.add('weather__forecast');
    weatherLinkWind.classList.add('link', 'link_black', 'link_nowrap');
    weatherLinkHumidity.classList.add('link', 'link_black', 'link_nowrap');
    widgetLink.href = 'https://yandex.ru/pogoda/simferopol';
    contentLink.href = 'https://yandex.ru/pogoda/simferopol';
    weatherIconContainer.style['background-image'] = `url('${data.icon}')`;
    weatherLinkWind.href = 'https://yandex.ru/pogoda/simferopol';
    weatherLinkHumidity.href = 'https://yandex.ru/pogoda/simferopol';
    weatherText.innerText = ',';

    container.appendChild(widgetHeader);

    widgetHeader.appendChild(widgetName);
    widgetName.appendChild(widgetLink);

    widgetLink.appendChild(widgetLinkTitle);

    container.appendChild(content);

    content.appendChild(contentLink);
    contentLink.appendChild(weatherIconContainer);

    contentLink.appendChild(weatherTemp);
    weatherTemp.appendChild(weatherTempValue);

    content.appendChild(weatherDescrip);
    weatherDescrip.appendChild(weatherLinkWind);

    weatherLinkWind.appendChild(weatherWindValue);

    weatherDescrip.appendChild(weatherText);
    weatherDescrip.appendChild(br);
    weatherDescrip.appendChild(weatherLinkHumidity);

    weatherLinkHumidity.appendChild(weatherHumidityValue);
    
    return container;
};

                      
//Шаблонизация в два прохода, создаем представление
function dataJSTemplate(data) {
    return {
        tag: 'main',
        cls: 'weather__main',
        content: [
            {
                tag: 'header',
                cls: 'weather__title',
                content: {
                    tag: 'h1',
                    content: {
                        tag: 'a',
                        cls: ['link', 'link_blue'],
                        attrs: { href: 'https://yandex.ru/pogoda/simferopol'},
                        content: 'Погода'
                    }
                }

            },
            {
                tag: 'content',
                cls: 'weather__content',
                content: [
                    {
                        tag: 'a',
                        cls: ['link', 'link_black', 'weather__box'],
                        attrs: { href: 'https://yandex.ru/pogoda/simferopol' },
                        content: [
                            {
                                tag: 'icon',
                                cls: 'weather__icon',
                                attrs: { style: `background-image: url('${data.icon}')` }
                            },
                            {
                                tag: 'title',
                                cls: 'weather__temp',
                                content: `${data.temperature}`
                            }
                        ]
                    },
                    {
                        tag: 'description',
                        cls: 'weather__forecast',
                        content: [
                            {
                                tag: 'a',
                                cls: ['link', 'link_black', 'link_nowrap'],
                                attrs: { href: 'https://yandex.ru/pogoda/simferopol' },
                                content: `${data.wind}`
                            },
                            {
                                tag: 'span',
                                content: ','
                            },
                            {
                                tag: 'br'
                            },
                            {
                                tag: 'a',
                                cls: ['link', 'link_black', 'link_nowrap'],
                                attrs: { href: 'https://yandex.ru/pogoda/simferopol' },
                                content: `${data.humidity}`
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

//Шаблонизация в два прохода, добавляем бизнес-логику
function browserJSEngine(block) {
    if ((block === undefined) || (block === null) || (block === false)) {
        return document.createTextNode('');
    }
    if ((typeof block === 'string') || (typeof block === 'number') || (block === true)) {
        return document.createTextNode(block.toString());
    }
    if (Array.isArray(block)) {
        return block.reduce(function(f, elem) {
            f.appendChild(browserJSEngine(elem));

            return f;
        }, document.createDocumentFragment());
    }
    var element = document.createElement(block.tag || 'div');
    element.classList.add(
        ...[].concat(block.cls).filter(Boolean)
    );
    if (block.attrs) {
        Object.keys(block.attrs).forEach(function(key) {
            element.setAttribute(key, block.attrs[key]);
        });
    }
    if (block.content) {
        element.appendChild(browserJSEngine(block.content));
    }

    return element;
};

//Приводим данные температуры из API к нужному нам виду.
//Добавляем тернарник для обработки плюсовых/минусовых температур (плюсовые передаются без знака, а в виджете знак нужен)
function getTemperature(data) {
    return `${data.main.temp.toString().split('.')[0] > 0 ? '+' : ''}${data.main.temp.toString().split('.')[0]}°`;
};

//Приводим данные о ветре к нужному виду
function getWind(data) {
    return `Ветер ${data.wind.speed.toString().split('.')[0]} км/ч`;
};

//Приводим данные о влажности к нужному нам виду
function getHumidity(data) {
    return `влажность ${data.main.humidity}%`;
};

//Подстановка иконки, соответствующей погоде
function getIcon(data) {
    return `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
};

//Формируем объект, где будут данные в подготовленном виде
function getWeather(data) {
    return {
        temperature: getTemperature(data),
        wind: getWind(data),
        humidity: getHumidity(data),
        icon: getIcon(data)
    };
};
