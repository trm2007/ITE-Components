LoginWrapper
============
Компонент Login (на VUE 2.6.11) выполнен в виде отдельной страницы.
###Подключение 
В js-файле:
```javascript
import Vue from 'vue';

import LoginWrapper from '../components/LoginPage/LoginWrapper.vue';

/**
здесь возможна настойка параметров 
LoginWrapper.props.ХХХ.default = ...;
*/

Vue.component("login-wrapper", LoginWrapper);

new Vue({el: '#login-div'}); //
```
Далее, в html-фале нужно вставить следующий код:
```html
<div id="login-div">
  <login-wrapper  
    user-name-placeholder="{{ 'security.login.username'|trans }}" 
    password-placeholder="{{ 'security.login.password'|trans }}"
    remember-label="{{ 'security.login.remember_me'|trans }}"
    submit-url="{{ path('fos_user_security_check') }}"
    form-title="Welcome to Exchange"
    background-image="/build/images/LoginComponents/back.jpg"
    feedback-email="evrinoma@gmail.com"
    {% if error %}
    error-message="{{ error.messageKey|trans(error.messageData, 'security') }}"
    {% endif %}
  />
</div>
```
В папке '../components/LoginComponents/images/back.jpg' хранится картинка фона по умолчанию.

###Настройка
Доступные параметры LoginWrapper на 08.10.2020 

[в js-файле (в html) - описание]:

- UserNamePlaceholder (user-name-placeholder) - placeholder для поля имя пользователя
- PasswordPlaceholder (password-placeholder) - placeholder для поля с паролем
- RememberLabel (remember-label) - если присвоено значение. то появлется checkbox remrmber_me с данной подписью
- FormTitle (form-title) - звголовок формы
- SubmitUrl (submit-url) - путь для action формы
- BackgroundImage (background-image)* - фоновая картинк, 
если картинка задана в js-файле через LoginWrapper.props.BackgroundImage.default = "...",
то она перекроет картинку по умолчанию подгружаемую из "assets\components\LoginComponents\images\back.jpg",
если картинка задана как атрибут div-а в HTML-файле, то она перекроет все другие (в js и по умолчанию)...
- FeedbackEmail (feedback-email) - E-mail для обратной связи, если задан, то справа появится надпись с предложением написать вопрос
- ErrorMessage (error-message) - сообщение об ощибке, если указано, то сверху формы будет выведено предупреждение

`*` в данной сборке WebPack настроен на копирование всего содержимого папки "assets/images" в папку "public/images"
