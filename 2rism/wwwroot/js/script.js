function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

let enterecode = "";

function moveToNext(input) {
    if (input.value.length == 1) {
        var next = input.nextElementSibling;
        if (next) {
            next.focus();
        } else {
            enterecode = document.getElementById('symbol1').value + document.getElementById('symbol2').value + document.getElementById('symbol3').value + document.getElementById('symbol4').value + document.getElementById('symbol5').value + document.getElementById('symbol6').value;
            $.ajax({
                type: "GET",
                url: `/api/Users/GetCode`,
                contentType: "application/json",
                dataType: "json",
                success: function (code) {
                    if (enterecode == code.value) {
                        let user_email = document.getElementById('email').value;
                        $.ajax({
                            type: "POST",
                            url: `/api/Users/AddCookie/${user_email}`,
                            contentType: "application/json",
                            dataType: "json",
                            success: function () {
                                window.location = '/Home';
                            }
                        });
                    }
                    else {
                        NewAlert('error', 'Код неверный');
                    }
                },
                error: function () {
                    NewAlert('error', 'Ошибка');
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.line-popular-place');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
        console.log(walk);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.line-popular-place-rest-hotel');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
        console.log(walk);
    });
});

function SendEmail(email) {
    $.ajax({
        type: "POST",
        url: `/api/Users/SendEmailForLogon/${email}`,
        contentType: "application/json",
        dataType: "json",
        success: function (email) {
            NewAlert('success', 'Вам отправлен код для входа в аккаунт!').then(() => {
                window.location.href = `/Logon/Authorization?email=${email.value}`;
            })
        },
        error: function () {
            alert("ошибка");
        }
    });
}

function RegistrationFirst(email, name, surname) {
    window.location.href = `/Logon/RegistrationContinue?email=${email}&name=${name}&surname=${surname}`;
};

function NewAlert(icon, title) {
    return Swal.fire({
        toast: true,
        icon: icon,
        title: title,
        animation: false,
        position: 'bottom',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
}
function RegistrationSecond(email, name, surname, password, repeatpassword) {
    if (password === repeatpassword) {
        $.ajax({
            type: "POST",
            url: `/api/Users/Register/${email}/${password}/${name}/${surname}`,
            contentType: "application/json",
            dataType: "json",
            success: function () {
                NewAlert('success', 'Успешная регистрация').then(() => {
                    window.location.href = `/Logon/Index`;
                })
            },
            error: function () {
                NewAlert('error', 'Ошибка');
            }
        });
    }
    else {
        NewAlert('error', 'Пароли не совпадают');
    }
};

function CheckAccess() {
    GetUser().then(function (user) {
        if (user.statusCode === 404) {
            window.location.href = '/Home';
        }
        else if (user.value.roleID === 2) {
            window.location.href = '/Administration';
        }
    });
};

function CheckAdministrationAccess() {
    GetUser().then(function (user) {
        if (user.statusCode === 404) {
            window.location.href = '/Home';
        }
        else if (user.value.roleID == 1) {
            window.location.href = '/Home';
        }
    });
};

function SetPlaceInformation() {
    var placeid = document.getElementById('placeid');
    $.ajax({
        type: "GET",
        url: `/api/Place/GetById/${placeid.value}`,
        contentType: "application/json",
        dataType: "json",
        success: function (place) { 
            document.getElementById('placenameMAIN').innerHTML = place.value.name;
            document.getElementById('placename').innerHTML = place.value.name;
            document.getElementById('placedesc').innerHTML = place.value.description;
            $.ajax({
                type: "GET",
                url: `/api/Place/GetCityName/${place.value.id}`,
                contentType: "application/json",
                dataType: "json",
                success: function (city) {
                    document.getElementById('placecityname').innerHTML = city.value;
                }
            });
            $.ajax({
                type: "GET",
                url: `/api/Place/GetCountryName/${place.value.id}`,
                contentType: "application/json",
                dataType: "json",
                success: function (country) {
                    document.getElementById('placecountryname').innerHTML = country.value;
                }
            });//placephoto
            document.getElementById('placephoto').style.background = `url(${place.value.imageURL})`;
        }
    });
};

function SetOpportunityToAdd() {
    var labeladdroute = document.getElementById('labeladdroute');
    GetUser().then(function (user) {
        if (user.statusCode === 404) {
            labeladdroute.style.display = 'none';
        }
        else if (user.value.roleID === 2) {
            labeladdroute.style.display = 'none';
        }
    });
}

function SetProfile() {
    var elem = document.getElementById('username');
    var myphoto = document.getElementById('myphoto');
    var usernamesurname = document.getElementById('usernamesurname');
    var useremail = document.getElementById('useremail');
    var userphoto = document.getElementById('userphoto');

    if (location.href.includes('/Home')) {
        getCities();
    }

    GetUser().then(function (user) {
        elem.innerHTML = user.value.name;
        if (user.value.photo !== null) {
            myphoto.src = '/profileimages/' + user.value.photo;
        }
        else {
            myphoto.src = '/resources/default-img.png';
        }
        if (location.href.includes('/Profile/Index')) {
            usernamesurname.innerHTML = user.value.name + " " + user.value.surname;
            useremail.innerHTML = user.value.email;
            if (user.value.photo !== null) {
                userphoto.src = '/profileimages/' + user.value.photo;
            }
            else
            {
                userphoto.src = '/resources/default-img.png';
            }
        }
    })
};

function SetUserHeader() {
    var username = document.getElementById('username');
    var myphoto = document.getElementById('myphoto');
    GetUser().then(function (user) {
        if (user.statusCode === 404) {
            username.innerText = 'пользователь';
            myphoto.style.display = 'none';
        }
        else {
            username.innerText = user.value.name;
            myphoto.src = '/profileimages/' + user.value.photo;
            linkbetweenlogonorprofile.href = '/Profile'
        }
    })
}

function SearchRoutes(cityid, arrivaldate, departuredate) {
    window.location.href = `/Routes/Index?cityid=${cityid}&arrivaldate=${arrivaldate}&departuredate=${departuredate}`;
}

function SetSearched() {
    var cityid = document.getElementById('selectedcityid').value;
    $.ajax({
        type: "GET",
        url: `/api/City/GetCityNameById/${cityid}`,
        contentType: "application/json",
        dataType: "json",
        success: function (cityname) {
            document.getElementById('selectedcityname').innerText = cityname.value;
        }
    });
    var ardt = document.getElementById('selectedarrivaldate').value.split(" ");
    document.getElementById('selectedarrivaldatelabel').innerText = ardt[0];
    var dpdt = document.getElementById('selecteddeparturedate').value.split(" ");
    document.getElementById('selecteddeparturedatelabel').innerText = dpdt[0];
};

function GetUser() {
    return new Promise(function (resolve) {
        $.ajax({
            type: "GET",
            url: `/api/Users/GetCurrentUser`,
            contentType: "application/json",
            dataType: "json",
            success: function (user) {
                resolve(user);
            }
        });
    });
};

function GetPlace(placeid) {
    return new Promise(function (resolve) {
        $.ajax({
            type: "GET",
            url: `/api/Place/GetById/${placeid}`,
            contentType: "application/json",
            dataType: "json",
            success: function (place) {
                resolve(place);
            }
        });
    });
};

function GetPlacesStringByRouteId(routeid) {
    return new Promise(function (resolve) {
        $.ajax({
            type: "GET",
            url: `/api/RoutePlace/GetPlacesStringByRouteId/${routeid}`,
            contentType: "application/json",
            dataType: "json",
            success: function (placesstring) {
                resolve(placesstring);
            }
        });
    });
};

function GetRouteLocation(routeid) {
    return new Promise(function (resolve) {
        $.ajax({
            type: "GET",
            url: `/api/Trails/GetRouteLocation/${routeid}`,
            contentType: "application/json",
            dataType: "json",
            success: function (routelocation) {
                resolve(routelocation);
            }
        });
    });
};

function GetPlaceLocation(placeid) {
    return new Promise(function (resolve) {
        $.ajax({
            type: "GET",
            url: `/api/Place/GetLocation/${placeid}`,
            contentType: "application/json",
            dataType: "json",
            success: function (place) {
                resolve(place);
            }
        });
    });
};

function openModalEditProfile(options) {
    GetUser().then(function (user) {
        const userid = user.value.userid;
        const url = options.url;
        const modal = $('#modal');

        $.ajax({
            type: 'GET',
            url: url,
            data: { "userid": userid },
            success: function (response) {
                $('.modal-dialog');
                modal.find(".modal-body").html(response);
                modal.modal('show');
            },
            failure: function () {
                modal.modal('hide');
            }
        }).then(() => {
            let containerElement = document.querySelector('#modal');
            containerElement.setAttribute('style', 'display: flex !important');
        }).then(() => {
            SetInfoInEditProfile();
        });
    });
};

function openModalEditPlace(options) {
    const placeid = document.getElementById('placeid').value;
    const url = options.url;
    const modal = $('#modal');

    $.ajax({
        type: 'GET',
        url: url,
        data: { "placeid": placeid },
        success: function (response) {
            $('.modal-dialog');
            modal.find(".modal-body").html(response);
            modal.modal('show');
        },
        failure: function () {
            modal.modal('hide');
        }
    }).then(() => {
        let containerElement = document.querySelector('#modal');
        containerElement.setAttribute('style', 'display: flex !important');
    }).then(() => {
        SetInfoAboutPlaceInEdit(placeid);
    });
};

function openModalDiplayRoute(options) {
    const routeid = options.routeid;
    const url = options.url;
    const modal = $('#modal');

    $.ajax({
        type: 'GET',
        url: url,
        data: { "routeid": routeid },
        success: function (response) {
            $('.modal-dialog');
            modal.find(".modal-body").html(response);
            modal.modal('show');
        },
        failure: function () {
            modal.modal('hide');
        }
    }).then(() => {
        let containerElement = document.querySelector('#modal');
        containerElement.setAttribute('style', 'display: flex !important');
    }).then(() => {
        var routeid = document.getElementById('routeid');
        $.ajax({
            type: "GET",
            url: `/api/Trails/GetById/${routeid.value}`,
            contentType: "application/json",
            dataType: "json",
            success: function (route) {
                var routedisplayname = document.getElementById('routedisplayname');
                var routedisplayplaces = document.getElementById('routedisplayplaces');
                var routedisplaylocation = document.getElementById('routedisplaylocation');

                routedisplayname.innerText = route.value.name;
                GetRouteLocation(route.value.id).then(function (routelocation) {
                    routedisplaylocation.innerText = routelocation.value;
                });
                GetPlacesStringByRouteId(route.value.id).then(function (routeplaces) {
                    routedisplayplaces.innerText = routeplaces.value;
                });

                GetPlacesIdsByRoute(route.value.id).then(function (ids) {
                    var placesids = ids.value;
                    console.log(placesids);
                    initMap();
                    async function initMap() {
                        ymaps.ready(init);
                        function init() {
                            var myMap = new ymaps.Map("map", {
                                center: [0, 0],
                                zoom: 10,
                                controls: ['fullscreenControl']
                            });

                            var firstPointCoordinates = null;
                            var coordinatesArray = [];

                            // Создаем массив промисов для запросов координат
                            var promises = placesids.map(placeid => {
                                return new Promise((resolve, reject) => {
                                    GetPlace(placeid).then(function (place) {
                                        GetPlaceLocation(place.value.id).then(function (placelocation) {
                                            var geocoder = ymaps.geocode(placelocation.value);
                                            geocoder.then(
                                                function (res) {
                                                    var coordinates = res.geoObjects.get(0).geometry.getCoordinates();

                                                    if (!firstPointCoordinates) {
                                                        firstPointCoordinates = coordinates;
                                                        myMap.setCenter(firstPointCoordinates, 10);
                                                    }

                                                    coordinatesArray.push(coordinates);

                                                    var placemark = new ymaps.Placemark(
                                                        coordinates, {
                                                        'hintContent': "test",
                                                        'balloonContent': "test"
                                                    }, {
                                                        'preset': 'islands#redDotIcon'
                                                    }
                                                    );
                                                    myMap.geoObjects.add(placemark);

                                                    resolve();
                                                },
                                                function (error) {
                                                    reject(error);
                                                }
                                            );
                                        });
                                    });
                                });
                            });

                            // Дожидаемся завершения всех промисов перед созданием маршрута
                            Promise.all(promises).then(() => {
                                createRoute(coordinatesArray);
                            }).catch(error => {
                                console.error('Ошибка при получении координат:', error);
                            });

                            function createRoute(coordinatesArray) {
                                // Создаем маршрут
                                ymaps.route(coordinatesArray).then(
                                    function (route) {
                                        // Добавляем маршрут на карту
                                        myMap.geoObjects.add(route);
                                    },
                                    function (error) {
                                        console.error('Ошибка при построении маршрута:', error);
                                    }
                                );
                            }
                        }
                    }
                })
            }
        });
        
    });
};

function openModalAddPlace(options) {
    const url = options.url;
    const modal = $('#modal');

    $.ajax({
        type: 'GET',
        url: url,
        success: function (response) {
            $('.modal-dialog');
            modal.find(".modal-body").html(response);
            modal.modal('show');
        },
        failure: function () {
            modal.modal('hide');
        }
    }).then(() => {
        let containerElement = document.querySelector('#modal');
        containerElement.setAttribute('style', 'display: flex !important');
    }).then(() => {
        getCitiesForAdmin();
    });
};

function SetInfoAboutPlaceInEdit(placeid) {
    $.ajax({
        type: "GET",
        url: `/api/Place/GetById/${placeid}`,
        contentType: "application/json",
        dataType: "json",
        success: function (place) {
            document.getElementById('placephoto').src = place.value.imageURL;
            document.getElementById('placephotourl').value = place.value.imageURL;
            document.getElementById('placename').value = place.value.name;
            document.getElementById('placedesc').value = place.value.description;
            document.getElementById('placehouse').value = place.value.house;

            $.ajax({
                type: "GET",
                url: `/api/Place/GetStreetName/${placeid}`,
                contentType: "application/json",
                dataType: "json",
                success: function (street) {
                    document.getElementById('placestreet').value = street.value;
                }
            });

            $.ajax({
                type: "GET",
                url: `/api/City/GetCityId/${placeid}`,
                contentType: "application/json",
                dataType: "json",
                success: function (cityid) {
                    fetch('/api/City/GetCitiesWithCountries')
                        .then(response => response.json())
                        .then(data => fillSelectForEditPlace(data, cityid.value))
                        .catch(error => console.error('Ошибка при получении данных:', error));
                }
            });
        }
    });
    
}

function SetInfoInEditProfile() {
    var surname = document.getElementById('surname');
    var name = document.getElementById('name');
    var patronymic = document.getElementById('patronymic');
    var photo = document.getElementById('photoinedit');

    GetUser().then(function (user) {
        surname.value = user.value.surname;
        name.value = user.value.name;
        patronymic.value = user.value.patronymic;
        photo.src = '/profileimages/' + user.value.photo;
    });
};

function GetPlacesIdsByRoute(routeid) {
    return new Promise(function (resolve) {
        $.ajax({
            type: "GET",
            url: `/api/RoutePlace/GetPlacesIdsByRoute/${routeid}`,
            contentType: "application/json",
            dataType: "json",
            success: function (place) {
                resolve(place);
            }
        });
    });
}; 

function UpdateUser(surname, name, patronymic, photo) {
    let formData = new FormData();
    formData.append('photo', photo);
    GetUser().then(function (user) {
        if (photo === undefined) {
            $.ajax({
                type: "PUT",
                url: `/api/Users/Update/${surname}/${name}/${patronymic}`,
                contentType: "application/json",
                dataType: "json",
                success: function () {
                    NewAlert('success', 'Успешное обновление данных').then(() => {
                        window.location.href = `/Profile`;
                    })
                },
                error: function () {
                    alert("ошибка");
                }
            });
        }
        else {
            fetch(`/api/Users/UpdatePhoto/${user.value.id}`, {
                method: 'POST',
                body: formData
            }).then(() => {
                $.ajax({
                    type: "PUT",
                    url: `/api/Users/Update/${surname}/${name}/${patronymic}`,
                    contentType: "application/json",
                    dataType: "json",
                    success: function () {
                        NewAlert('success', 'Успешное обновление данных').then(() => {
                            window.location.href = `/Profile`;
                        })
                    },
                    error: function () {
                        alert("ошибка");
                    }
                });
            });
        }
    });
};

function UpdatePassword(oldpass, pass, reppass) {
    GetUser().then(function (user) {
        if (pass === reppass) {
            $.ajax({
                type: "GET",
                url: `/api/Users/GetTrueOldPass/${user.value.id}/${oldpass}`,
                contentType: "application/json",
                dataType: "json",
                success: function (boolvariable) {
                    if (boolvariable.value === true) {
                        $.ajax({
                            type: "PUT",
                            url: `/api/Users/UpdatePassword/${user.value.id}/${pass}`,
                            contentType: "application/json",
                            dataType: "json",
                            success: function () {
                                NewAlert('success', 'Успешное обновление пароля').then(() => {
                                    var oldpassword = document.getElementById('oldpassword');
                                    oldpassword.value = "";
                                    var password = document.getElementById('password');
                                    password.value = "";
                                    var reppassword = document.getElementById('reppassword');
                                    reppassword.value = "";
                                })
                            }
                        });
                    }
                    else {
                        NewAlert('error', 'Старый пароль неверный');
                    }
                }
            });
        }
        else {
            NewAlert('error', 'Пароли различаются');
        }
    });
}

function openModalAddRoute(options) {
    GetUser().then(function (user) {
        const userid = user.value.userid;
        const url = options.url;
        const modal = $('#modal');

        $.ajax({
            type: 'GET',
            url: url,
            success: function (response) {
                $('.modal-dialog');
                modal.find(".modal-body").html(response);
                modal.modal('show');
            },
            failure: function () {
                modal.modal('hide');
            }
        }).then(() => {
            let containerElement = document.querySelector('#modal');
            containerElement.setAttribute('style', 'display: flex !important');
        }).then(() => {
            SetPlacesInSelect(3);
        })
    });
};

function SetPlacesInSelect(cityid) {
    $.ajax({
        type: "GET",
        url: `/api/Place/GetNames?cityid=${cityid}`,
        contentType: "application/json",
        dataType: "json",
        success: function (places) {
            var placeslistinadd = document.getElementById('placeslistinadd');

            places.value.forEach((place) => {
                const opt = document.createElement("option");
                opt.value = place.item1;
                opt.innerHTML = place.item2;
                placeslistinadd.appendChild(opt);
            })
        },
        error: function () {
            alert("ошибка");
        }
    });
};

function AssembleRoute(select) {
    var btnassemble = document.getElementById('btnassemble');
    btnassemble.style.display = 'none';
    var placesids = getSelectValues(select);
    initMap().then(() => {
        var afterdisplaymap = document.getElementById('afterdisplaymap');
        afterdisplaymap.style.display = 'block';
    });
    async function initMap() {
        ymaps.ready(init);
        function init() {
            var myMap = new ymaps.Map("map", {
                center: [0, 0], // Центр карты, будет изменен после получения координат первой точки
                zoom: 10,
                controls: ['fullscreenControl'] // Полноэкранный режим
            });

            var firstPointCoordinates = null;
            var coordinatesArray = []; // Массив для хранения координат всех точек

            // Создаем массив промисов для запросов координат
            var promises = placesids.map(placeid => {
                return new Promise((resolve, reject) => {
                    GetPlace(placeid).then(function (place) {
                        GetPlaceLocation(place.value.id).then(function (placelocation) {
                            var geocoder = ymaps.geocode(placelocation.value);
                            geocoder.then(
                                function (res) {
                                    var coordinates = res.geoObjects.get(0).geometry.getCoordinates();

                                    if (!firstPointCoordinates) {
                                        firstPointCoordinates = coordinates;
                                        myMap.setCenter(firstPointCoordinates, 10);
                                    }

                                    coordinatesArray.push(coordinates);

                                    var placemark = new ymaps.Placemark(
                                        coordinates, {
                                        'hintContent': "test",
                                        'balloonContent': "test"
                                    }, {
                                        'preset': 'islands#redDotIcon'
                                    }
                                    );
                                    myMap.geoObjects.add(placemark);

                                    resolve();
                                },
                                function (error) {
                                    reject(error);
                                }
                            );
                        });
                    });
                });
            });

            // Дожидаемся завершения всех промисов перед созданием маршрута
            Promise.all(promises).then(() => {
                createRoute(coordinatesArray);
            }).catch(error => {
                console.error('Ошибка при получении координат:', error);
            });

            function createRoute(coordinatesArray) {
                // Создаем маршрут
                ymaps.route(coordinatesArray).then(
                    function (route) {
                        // Добавляем маршрут на карту
                        myMap.geoObjects.add(route);
                    },
                    function (error) {
                        console.error('Ошибка при построении маршрута:', error);
                    }
                );
            }
        }
    }
};

function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
};

function SavedRoute(routename, select) {
    var radios = document.getElementsByName('group1');
    var placesids = getSelectValues(select);

    GetUser().then(function (user) {
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                if (radios[i].value === "true") {
                    var requestData = {
                        name: routename,
                        userid: user.value.id,
                        ispublic: true,
                        placesids: placesids
                    };
                }
                else {
                    var requestData = {
                        name: routename,
                        userid: user.value.id,
                        ispublic: false,
                        placesids: placesids
                    };
                }

                $.ajax({
                    type: "POST",
                    url: `/api/Trails/Add`,
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(requestData),
                    success: function () {
                        NewAlert('success', 'Маршрут создан').then(() => {
                            window.location.href = "/Routes";
                        })
                    }
                });
            }
        }
    }).catch(function (error) {
        console.error("Ошибка при получении пользователя:", error);
    });
};

function DisplayRoutes() {
    var cityid = document.getElementById('selectedcityid').value;
    $.ajax({
        type: "GET",
        url: `/api/Trails/GetAll?${cityid}`,
        contentType: "application/json",
        dataType: "json",
        success: function (routes) {
            if (routes.value.length !== 0) {
                var element = document.getElementById("routeslists");
                var routeslists = document.getElementById('routeslists');
                routeslists.innerHTML += routes.value.length;
                routes.value.forEach((route) => {
                    GetPlacesStringByRouteId(route.id).then(function (placesstring) {
                        var newElement = `<div class="justify-contentspace-between" style="margin-bottom: 15px;"><div class="line-route-all"><img class="one-popular-place-img" src="https://images.unsplash.com/photo-1601425262040-ba23fe84f701?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"><div class="one-route-text-all"><p class="route-name-text">${route.name}</p><p class="route-city opacity07">${placesstring.value}</p><p class="route-city opacity07">`;
                        GetRouteLocation(route.id).then(function (routelocation) {
                            newElement += `${routelocation.value}</p></div></div><div style="display: flex; align-items: center;"><div class="section-button-more-route" style="align-items: center;" onclick="openModalDiplayRoute({ url: '/Routes/Display', routeid: ${route.id}})">Больше<img src="/resources/bleft.png" alt=""></div></div></div >`
                            element.insertAdjacentHTML('afterend', newElement);
                        });
                    });
                })
            }
            else {
                var routeslists = document.getElementById('routeslists');
                routeslists.innerHTML += routes.value.length;
            }
        }
    });
};

function SetMyRoutes() {
    GetUser().then(function (user) {
        $.ajax({
            type: "GET",
            url: `/api/Trails/GetSaved/${user.value.id}`,
            contentType: "application/json",
            dataType: "json",
            success: function (routes) {
                if (routes.value.length !== 0) {
                    var element = document.getElementById("routeslists");
                    var myroutesnumbers = document.getElementById('myroutesnumbers');
                    routes.value.forEach((route) => {
                        GetPlacesStringByRouteId(route.id).then(function (placesstring) {
                            var newElement = `<div class="justify-contentspace-between" style="margin-bottom: 15px;"><div class="line-route-all"><img class="one-popular-place-img" src="https://images.unsplash.com/photo-1601425262040-ba23fe84f701?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"><div class="one-route-text-all"><p class="route-name-text">${route.name}</p><p class="route-city opacity07">${placesstring.value}</p><p class="route-city opacity07">`;
                            GetRouteLocation(route.id).then(function (routelocation) {
                                newElement += `${routelocation.value}</p></div></div><div style="display: flex; align-items: center;"><div class="section-button-more-route" style="align-items: center;" onclick="openModalDiplayRoute({ url: '/Routes/Display', routeid: ${route.id}})">Больше<img src="/resources/bleft.png" alt=""></div></div></div >`
                                element.insertAdjacentHTML('afterend', newElement);
                            });
                        });
                    });
                    myroutesnumbers.innerText = routes.value.length;
                    GetRoutesLabel(routes.value.length);
                }
                else {
                    var myroutesnumbers = document.getElementById('myroutesnumbers');
                    myroutesnumbers.innerText = routes.value.length;
                    GetRoutesLabel(routes.value.length);
                }
            }
        });
    });
};

function GetRoutesLabel(routescount) {
    var myroutesnumberslabel = document.getElementById('myroutesnumberslabel');
    switch (routescount) {
        case 0:
            myroutesnumberslabel.innerText = "Маршрутов";
            break;
        case 1:
            myroutesnumberslabel.innerText = "Маршрут";
            break;
        case 2:
            myroutesnumberslabel.innerText = "Маршрута";
            break;
        case 3:
            myroutesnumberslabel.innerText = "Маршрута";
            break;
        case 4:
            myroutesnumberslabel.innerText = "Маршрута";
            break;
        case 21:
            myroutesnumberslabel.innerText = "Маршрут";
            break;
        case 22:
            myroutesnumberslabel.innerText = "Маршрута";
            break;
        case 23:
            myroutesnumberslabel.innerText = "Маршрута";
            break;
        case 24:
            myroutesnumberslabel.innerText = "Маршрута";
            break;
        default:
            myroutesnumberslabel.innerText = "Маршрутов";
    }
}

function getCities() {
    fetch('/api/City/GetCitiesWithCountries')
        .then(response => response.json())
        .then(data => fillSelect(data))
        .catch(error => console.error('Ошибка при получении данных:', error));
}

// Функция для заполнения select с данными о городах
function fillSelect(data) {
    var select = document.getElementById('searchcity');

    data.value.forEach(country => {
        var optgroup = document.createElement('optgroup');
        optgroup.label = country.country;

        country.cities.forEach(city => {
            var option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            optgroup.appendChild(option);
        });

        select.appendChild(optgroup);
    });
}

function getCitiesForAdmin() {
    fetch('/api/City/GetCitiesWithCountries')
        .then(response => response.json())
        .then(data => fillSelectForAdmin(data))
        .catch(error => console.error('Ошибка при получении данных:', error));
}

function fillSelectForAdmin(data) {
    var placecity = document.getElementById('placecity');

    data.value.forEach(country => {
        var optgroup = document.createElement('optgroup');
        optgroup.label = country.country;

        country.cities.forEach(city => {
            var option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            optgroup.appendChild(option);
        });

        placecity.appendChild(optgroup);
    });
};

function fillSelectForEditPlace(data, selectedid) {
    var placecity = document.getElementById('placecity');

    data.value.forEach(country => {
        var optgroup = document.createElement('optgroup');
        optgroup.label = country.country;

        country.cities.forEach(city => {
            var option = document.createElement('option');
            if (city.id == selectedid) {
                option.selected = true;
            }
            option.value = city.id;
            option.textContent = city.name;
            optgroup.appendChild(option);
        });

        placecity.appendChild(optgroup);
    });
};

function updatePlacePhotoInPage() {
    var placephoto = document.getElementById('placephoto');
    var placephotourl = document.getElementById('placephotourl').value;

    if (placephotourl !== "") {
        placephoto.src = placephotourl;
    } else {
        placephoto.src = '/resources/zaglushka-img.jpg';
    }
};

function AddPlace(placephotourl, placename, placedesc, placecity, placestreet, placehouse) {
    $.ajax({
        type: "POST",
        url: `/api/Place/Add/${placename}/${placedesc}/${placecity}/${placestreet}/${placehouse}?imageurl=${placephotourl}`,
        contentType: "application/json",
        dataType: "json",
        success: function () {
            NewAlert('success', 'Достопримечательность добавлена').then(() => {
                location.reload();
            })
        }
    });
};

function EditPlace(placephotourl, placename, placedesc, placecity, placestreet, placehouse) {
    var placeid = document.getElementById('placeid').value;
    $.ajax({
        type: "POST",
        url: `/api/Place/Edit/${placeid}/${placename}/${placedesc}/${placecity}/${placestreet}/${placehouse}?imageurl=${placephotourl}`,
        contentType: "application/json",
        dataType: "json",
        success: function () {
            NewAlert('success', 'Достопримечательность обновлена').then(() => {
                location.reload();
            })
        }
    });
}

function SetPlaces() {
    var placeslists = document.getElementById('placeslists');
    $.ajax({
        type: "GET",
        url: `/api/Place/GetAll`,
        contentType: "application/json",
        dataType: "json",
        success: function (places) {
            places.value.forEach((place) => {
                console.log(place);
                $.ajax({
                    type: "GET",
                    url: `/api/Place/GetCityName/${place.id}`,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (placecity) {
                        newElement = `<div class="ob-block">
                            <div class="ob-back">
                                <div class="ob-img" style="background-image: url(${place.imageURL});"></div>
                                <div class="ob-blur" style="background-image: url(${place.imageURL});"></div>
                                <div class="ob-grad"></div>
                            </div>
                            <a class="ob-href">
                                <div class="ob-text">
                                    <div class="ob-tz">${place.name}</div>
                                    <div class="ob-ta">${place.description}</div>
                                </div>
                            </a>
                            <a class="city-href">${placecity.value}</a>
                        </div>`;
                        placeslists.insertAdjacentHTML('afterbegin', newElement);
                    }
                });
                
            })
        }
    })
}