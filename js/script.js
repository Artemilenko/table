// (function() {
//     class MultiWidget {
//         constructor(lField, rField, lText, rText, searchField, lArrow, rArrow, btnSearch, path, userStyle, userCountLeft, userCountRight) {
//             this.leftField = document.querySelector(lField);
//             this.rightField = document.querySelector(rField);
//             this.leftText = document.querySelector(lText);
//             this.rightText = document.querySelector(rText);
//             this.searchField = document.querySelector(searchField);
//             this.leftArrow = document.querySelector(lArrow);
//             this.rightArrow = document.querySelector(rArrow);
//             this.buttonSearch = document.querySelector(btnSearch);
//             this.path = path;
//             this.userStyle = userStyle;
//             this.userCountLeft = document.querySelector(userCountLeft);
//             this.userCountRight = document.querySelector(userCountRight);
//             this.countRight = 0;
//             this.countLeft = 0;
//             this.users = {};
//             this.ids = {};
//         }

//         async get(url) {
//             let result = await fetch(url);

//             if (!result.ok) {
//                 throw new Error(`Could not fetch ${url}, status: ${result.status}`);
//             }

//             return await result.json();
//         }

//         createUser(name, outputField, style) {
//             const user = document.createElement('div');
//             user.classList.add(style, 'selected__user');
//             outputField.append(user);

//             user.textContent = name;
//         }

//         counter(field, count) {
//             if (field.children.length === 0) {
//                 count.textContent = 'Geen';
//             } else {
//                 count.textContent = field.children.length;
//             }
//         }

//         counterRun() {
//             this.counter(this.leftField, this.userCountLeft);
//             this.counter(this.rightField, this.userCountRight);
//         }

//         search(btn) {
//             btn.addEventListener('click', () => {
//                 this.rightText.classList.toggle('active__right-text');
//                 this.searchField.classList.toggle('active__header-search');
//             });
//         }

//         enumeratingItemsForBuffer(bufferObj, mainObj) {
//             for (let key in mainObj) {
//                 bufferObj[Object.keys(bufferObj).length] = mainObj[key];
//             }
//         }

//         creatingMultipleUsers(obj, field, styleClass) {
//             for (let key in obj) {
//                 this.createUser(obj[key].name, field, styleClass);
//             }
//         }

//         enumeratingForOneItem(enumeratingObj, mainObj, target) {
//             for (let key in enumeratingObj) {
//                 if (enumeratingObj[key].name === target) {
//                     let buffer = {};

//                     this.enumeratingItemsForBuffer(buffer, mainObj);

//                     mainObj = {};

//                     mainObj[key] = enumeratingObj[key];

//                     this.enumeratingItemsForBuffer(buffer, mainObj);

//                     mainObj = Object.assign({}, buffer);

//                     delete enumeratingObj[key];
//                 }
//             }
//         }

//         getUsers(searchField, outputField) {
//             let reg;
//             searchField.addEventListener('input', () => {
//                 if (searchField.value.length > 0) {
//                     this.value = searchField.value;
//                     this.users = {};
//                     this.countRight = 0;
//                     reg = new RegExp(searchField.value, 'gi');

//                     if (this.leftField.children.length === 0) {
//                         this.ids = {};

//                         this.get('js/db.json')
//                         .then(response => {
//                             for (let key in response) {
//                                 if (response[key].search(reg) != -1 && searchField.value.length != 0) {
//                                     this.createUser(response[key], outputField, 'multiselect-widget__force-right');

//                                     this.countRight++;
                                    
//                                     this.counterRun();

//                                     this.users[Object.keys(this.users).length] = {id: key, name: response[key]};
//                                 }
//                             }
//                         });
//                         outputField.innerHTML = '';
//                     } else {
//                         this.get('js/db.json')
//                         .then(response => {
//                             let flag = 0;
//                             for (let key in response) {
//                                 for (let guest in this.ids) {
//                                     if (this.ids[guest].id !== key) {
//                                         flag++;
//                                     }
//                                 }
//                                 if (Object.keys(this.ids).length === flag) {
//                                     console.log(response[key]);
//                                     if (response[key].search(reg) != -1 && searchField.value.length != 0) {
//                                         this.createUser(response[key], outputField, 'multiselect-widget__force-right');

//                                         this.countRight++;

//                                         this.counterRun();

//                                         this.users[Object.keys(this.users).length] = {id: key, name: response[key]};
//                                     }
//                                 }
//                                 flag = 0
//                             }
//                         });
//                         outputField.innerHTML = '';
//                     }
//                 }
//             });
//         }

//         redirectAllRight(btn, outputField) {
//             btn.addEventListener('click', () => {
//                 if (this.leftField.children.length !== 0) {
//                     this.rightField.innerHTML = '';

//                     this.creatingMultipleUsers(this.users, outputField, 'multiselect-widget__force-left');

//                     let buffer = {};

//                     this.enumeratingItemsForBuffer(buffer, this.users);
//                     this.enumeratingItemsForBuffer(buffer, this.ids);

//                     this.ids = Object.assign({}, buffer);

//                     this.users = {};

//                     this.counterRun();
//                 } else {
//                     this.rightField.innerHTML = '';

//                     this.creatingMultipleUsers(this.users, outputField, 'multiselect-widget__force-left');
                    
//                     this.ids = Object.assign({}, this.users);
//                     this.users = {};

//                     this.counterRun();
//                 }
//             });
//         }

//         redirectAllLeft(btn, outputField) {
//             btn.addEventListener('click', () => {
//                 if (outputField.children.length !== 0) {
//                     this.creatingMultipleUsers(this.ids, outputField, 'multiselect-widget__force-right');

//                     let buffer = {};

//                     this.enumeratingItemsForBuffer(buffer, this.users);
//                     this.enumeratingItemsForBuffer(buffer, this.ids);

//                     this.users = Object.assign({}, buffer);

//                     this.leftField.innerHTML = '';

//                     this.ids = {};

//                     this.counterRun();
//                 } else {
//                     this.creatingMultipleUsers(this.ids, outputField, 'multiselect-widget__force-right');

//                     this.leftField.innerHTML = '';

//                     this.users = Object.assign({}, this.ids);

//                     this.ids = {};

//                     this.counterRun();
//                 }
//             });
//         }

//         redirectOneRight(fieldFrom, fieldTo) {
//             fieldFrom.addEventListener('click', e => {
//                 const target = e.target || e.srcElement;
//                 if (target && target.classList.contains('selected__user')) {
//                     for (let i = 0; i < fieldFrom.children.length; i++) {
//                         this.enumeratingForOneItem(this.users, this.ids, target);

//                         target.classList.remove('multiselect-widget__force-right');
//                         target.classList.add('multiselect-widget__force-left');

//                         fieldTo.append(target);

//                         this.counterRun();
//                     }
//                 }
//             });
//         }

//         redirectOneLeft(fieldFrom, fieldTo) {
//             fieldFrom.addEventListener('click', e => {
//                 const target = e.target || e.srcElement;
//                 if (target && target.classList.contains('selected__user')) {
//                     for (let i = 0; i < fieldFrom.children.length; i++) {
//                         this.enumeratingForOneItem(this.ids, this.users, target);

//                         fieldTo.innerHTML = '';

//                         this.creatingMultipleUsers(this.users, fieldTo, 'multiselect-widget__force-right');

//                         target.remove();

//                         this.counterRun();
//                     }
//                 }
//             });
//         }

//         // async dataPost(url, body) {
//         //     const data = await fetch(url, {
//         //         method: "POST",
//         //         body: body
//         //     });

//         //     if (!result.ok) {
//         //         throw new Error(`Could not fetch ${url}, status: ${result.status}`);
//         //     }

//         //     return await data.text();
//         // }

//         // formPost() {
//         //     const form = document.querySelector('.form');

//         //     form.addEventListener('submit', e => {
//         //         e.preventDefault();

//         //         const formData = new FormData(form);

//         //         for (let key in this.ids) {
//         //             formData.append(key, this.ids[key].id);
//         //         }

//         //         this.dataPost('js/server.php', formData)
//         //         .then(response => console.log(response));
//         //     });
//         // }

//         init() {
//             this.getUsers(this.searchField, this.rightField);
//             this.redirectAllRight(this.rightArrow, this.leftField);
//             this.redirectAllLeft(this.leftArrow, this.rightField);
//             this.search(this.buttonSearch);
//             this.redirectOneRight(this.rightField, this.leftField);
//             this.redirectOneLeft(this.leftField, this.rightField);
//             // this.formPost();
//         }
//     }

//     new MultiWidget('.multiselect-widget__list-content--left', '.multiselect-widget__list-content--right', '.multiselect-widget__header-text--left', '.multiselect-widget__header-text--right', '.multiselect-widget__header-search', '.multiselect-widget__button--arrow-left', '.multiselect-widget__button--arrow-right', '.multiselect-widget__button--search', 'js/db.json', 'multiselect-widget__force-right', '.multiselect-widget__count--left', '.multiselect-widget__count--right').init();
// }());


(function() {
    class MultiWidget {
        constructor(lField, rField, lText, rText, searchField, lArrow, rArrow, btnSearch, path, userStyle, userCountLeft, userCountRight) {
            this.leftField = document.querySelector(lField);
            this.rightField = document.querySelector(rField);
            this.leftText = document.querySelector(lText);
            this.rightText = document.querySelector(rText);
            this.searchField = document.querySelector(searchField);
            this.leftArrow = document.querySelector(lArrow);
            this.rightArrow = document.querySelector(rArrow);
            this.buttonSearch = document.querySelector(btnSearch);
            this.path = path;
            this.userStyle = userStyle;
            this.userCountLeft = document.querySelector(userCountLeft);
            this.userCountRight = document.querySelector(userCountRight);
            this.countRight = 0;
            this.countLeft = 0;
            this.users = {};
            this.ids = {};
        }

        async get(url) {
            let result = await fetch(url);

            if (!result.ok) {
                throw new Error(`Could not fetch ${url}, status: ${result.status}`);
            }

            return await result.json();
        }

        createUser(name, outputField, style) {
            const user = document.createElement('div');
            user.classList.add(style, 'selected__user');
            outputField.append(user);

            user.textContent = name;
        }

        getUsers(searchField, outputField) {
            let reg;
            searchField.addEventListener('input', () => {
                if (searchField.value.length > 0) {
                    this.value = searchField.value;
                    this.users = {};
                    
                    this.countRight = 0;
                    reg = new RegExp(searchField.value, 'gi');
                    if (this.leftField.children.length === 0) {
                        this.ids = {};
                        this.get('js/db.json')
                        .then(response => {
                            for (let key in response) {
                                if (response[key].search(reg) != -1 && searchField.value.length != 0) {
                                    this.createUser(response[key], outputField, 'multiselect-widget__force-right');
                                    this.countRight++;
                                    
                                    this.counter(this.rightField, this.userCountRight);
                                    this.counter(this.leftField, this.userCountLeft);

                                    this.users[Object.keys(this.users).length] = {id: key, name: response[key]};

                                    console.log(this.ids);
                                }
                            }
                        });
                        outputField.innerHTML = '';
                    } else {
                        this.get('js/db.json')
                        .then(response => {
                            let flag = false;
                            for (let key in response) {
                                for (let guest in this.ids) {
                                    if (this.ids[guest].id !== key) {
                                        flag++;
                                    }
                                }
                                if (Object.keys(this.ids).length === flag) {
                                    console.log(response[key]);
                                    if (response[key].search(reg) != -1 && searchField.value.length != 0) {
                                        this.createUser(response[key], outputField, 'multiselect-widget__force-right');
                                        this.countRight++;

                                        this.counter(this.rightField, this.userCountRight);
                                        this.counter(this.leftField, this.userCountLeft);

                                        this.users[Object.keys(this.users).length] = {id: key, name: response[key]};

                                        console.log(this.ids);
                                    }
                                }
                                flag = 0

                                // if (response[key].search(reg) != -1 && searchField.value.length != 0) {
                                //     this.users[Object.keys(this.users).length] = {id: key, name: response[key]};
                                // }
                            }

                            // console.log(this.ids[0].name, this.users[0].name);

                            // for (let i = 0; i < Object.keys(this.users).length; i++) {
                            //     for (let j = 0; j < Object.keys(this.ids).length; j++) {
                            //         console.log(this.users[i].name, this.ids[j].name);
                            //         if (this.users[i].name === this.ids[j].name) {
                            //             continue;
                            //         } else {
                            //             this.createUser(this.users[i].name, outputField, 'multiselect-widget__force-right');
                            //             this.countRight++;

                            //             this.counter(this.rightField, this.userCountRight);
                            //             this.counter(this.leftField, this.userCountLeft);

                            //             console.log(this.ids);
                            //         }
                            //     }
                            // }
                        });
                        outputField.innerHTML = '';
                    }
                    
                }
            });
        }

        redirectAllRight(btn, outputField) {
            btn.addEventListener('click', () => {
                if (this.leftField.children.length !== 0) {
                    this.rightField.innerHTML = '';
                    for (let key in this.users) {
                        console.log('qwerty');
                        this.createUser(this.users[key].name, outputField, 'multiselect-widget__force-left');
                    }
                    
                    // for (let i = 1; i < Object.keys(this.users).length; i++) {
                    //     this.ids[i] = this.users[key];
                    // }
                    // for (let key in this.users) {
                    //     this.ids[+key + 1 + ''] = this.users[key];
                    // }

                    let buffer = {};

                    for (let key in this.ids) {
                        buffer[Object.keys(buffer).length] = this.ids[key];
                    }

                    // this.ids = {};

                    for (let key in this.users) {
                        buffer[Object.keys(buffer).length] = this.users[key];
                    }

                    this.ids = Object.assign({}, buffer);

                    this.users = {};

                    this.counter(this.leftField, this.userCountLeft);
                    this.counter(this.rightField, this.userCountRight);

                    console.log(this.users);
                    console.log(this.ids);
                } else {
                    this.rightField.innerHTML = '';
                    for (let key in this.users) {
                        console.log('qwerty');
                        this.createUser(this.users[key].name, outputField, 'multiselect-widget__force-left');
                    }
                    
                    this.ids = Object.assign({}, this.users);
                    this.users = {};

                    this.counter(this.leftField, this.userCountLeft);
                    this.counter(this.rightField, this.userCountRight);

                    console.log(this.users);
                    console.log(this.ids);
                }
                
                
            });
        }

        redirectAllLeft(btn, outputField) {
            btn.addEventListener('click', () => {
                if (outputField.children.length !== 0) {
                    for (let key in this.ids) {
                        console.log('qwerty');
                        this.createUser(this.ids[key].name, outputField, 'multiselect-widget__force-right');
                    }

                    let buffer = {};

                    for (let key in this.users) {
                        buffer[Object.keys(buffer).length] = this.users[key];
                    }

                    for (let key in this.ids) {
                        buffer[Object.keys(buffer).length] = this.ids[key];
                    }

                    // this.ids = {};

                    // for (let key in this.users) {
                    //     buffer[Object.keys(buffer).length] = this.users[key];
                    // }

                    this.users = Object.assign({}, buffer);

                    this.leftField.innerHTML = '';
                    // outputField.innerHTML = '';

                    // for (let key in this.ids) {
                    //     this.users[key] = this.ids[key];
                    // }

                    this.ids = {};

                    this.counter(this.leftField, this.userCountLeft);
                    this.counter(this.rightField, this.userCountRight);

                    console.log(this.ids);
                } else {
                    for (let key in this.ids) {
                        console.log('qwerty');
                        this.createUser(this.ids[key].name, outputField, 'multiselect-widget__force-right');
                    }

                    this.leftField.innerHTML = '';

                    this.users = Object.assign({}, this.ids);
                    this.ids = {};

                    this.counter(this.leftField, this.userCountLeft);
                    this.counter(this.rightField, this.userCountRight);

                    console.log(this.ids);
                }
            });
        }

        redirectOneRight(fieldFrom, fieldTo) {
            fieldFrom.addEventListener('click', e => {
                const target = e.target || e.srcElement;

                if (target && target.classList.contains('selected__user')) {

                    for (let i = 0; i < fieldFrom.children.length; i++) {
                        for (let key in this.users) {
                            if (this.users[key].name === target.textContent) {
                                let buffer = {};

                                for (let key in this.ids) {
                                    buffer[Object.keys(buffer).length] = this.ids[key];
                                }

                                this.ids = {};

                                this.ids[key] = this.users[key];

                                for (let key in this.ids) {
                                    buffer[Object.keys(buffer).length] = this.ids[key];
                                }

                                // for (let key in this.users) {
                                //     buffer[Object.keys(buffer).length] = this.users[key];
                                // }

                                this.ids = Object.assign({}, buffer);

                                // this.users = {};

                                delete this.users[key];
                            }
                        }

                        // let buffer = {};

                        // for (let key in this.ids) {
                        //     buffer[Object.keys(buffer).length] = this.ids[key];
                        // }

                        // for (let key in this.users) {
                        //     buffer[Object.keys(buffer).length] = this.users[key];
                        // }

                        // this.ids = Object.assign({}, buffer);

                        // this.users = {};

                        target.classList.remove('multiselect-widget__force-right');
                        target.classList.add('multiselect-widget__force-left');
                        fieldTo.append(target);
                        this.counter(this.leftField, this.userCountLeft);
                        this.counter(this.rightField, this.userCountRight);
                    }

                    console.log(this.users);
                    console.log(this.ids);
                }
            });
        }

        redirectOneLeft(fieldFrom, fieldTo) {
            fieldFrom.addEventListener('click', e => {
                const target = e.target || e.srcElement;

                if (target && target.classList.contains('selected__user')) {

                    for (let i = 0; i < fieldFrom.children.length; i++) {
                        for (let key in this.ids) {
                            if (this.ids[key].name === target.textContent) {
                                let buffer = {};

                                for (let key in this.users) {
                                    buffer[Object.keys(buffer).length] = this.users[key];
                                }

                                this.users = {};

                                this.users[key] = this.ids[key];

                                for (let key in this.users) {
                                    buffer[Object.keys(buffer).length] = this.users[key];
                                }

                                // for (let key in this.users) {
                                //     buffer[Object.keys(buffer).length] = this.users[key];
                                // }

                                this.users = Object.assign({}, buffer);

                                delete this.ids[key];
                            }
                        }

                        fieldTo.innerHTML = '';

                        for (let key in this.users) {
                            this.createUser(this.users[key].name, fieldTo, 'multiselect-widget__force-right');
                        }

                        console.log(this.users);
                        console.log(this.ids);

                        target.remove();

                        this.counter(this.leftField, this.userCountLeft);
                        this.counter(this.rightField, this.userCountRight);
                    }
                }
            });
        }

        counter(field, count) {
            if (field.children.length === 0) {
                count.textContent = 'Geen';
            } else {
                count.textContent = field.children.length;
            }
        }

        search(btn) {
            btn.addEventListener('click', () => {
                this.rightText.classList.toggle('active__right-text');
                this.searchField.classList.toggle('active__header-search');
            });
        }

        async dataPost(url, body) {
            const data = await fetch(url, {
                method: "POST",
                body: body
            });

            return await data.text();
        }

        formPost() {
            const form = document.querySelector('.form');

            form.addEventListener('submit', e => {
                e.preventDefault();

                const formData = new FormData(form);

                for (let key in this.ids) {
                    formData.append(key, this.ids[key].id);
                }

                // const json = JSON.stringify(formData);

                this.dataPost('js/server.php', formData)
                .then(response => console.log(response));
            });
        }

        init() {
            this.getUsers(this.searchField, this.rightField);
            this.redirectAllRight(this.rightArrow, this.leftField);
            this.redirectAllLeft(this.leftArrow, this.rightField);
            this.search(this.buttonSearch);
            this.redirectOneRight(this.rightField, this.leftField);
            this.redirectOneLeft(this.leftField, this.rightField);
            this.formPost();
        }
    }

    new MultiWidget('.multiselect-widget__list-content--left', '.multiselect-widget__list-content--right', '.multiselect-widget__header-text--left', '.multiselect-widget__header-text--right', '.multiselect-widget__header-search', '.multiselect-widget__button--arrow-left', '.multiselect-widget__button--arrow-right', '.multiselect-widget__button--search', 'js/db.json', 'multiselect-widget__force-right', '.multiselect-widget__count--left', '.multiselect-widget__count--right').init();
}());