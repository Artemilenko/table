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
                            let flag = 0;
                            for (let key in response) {
                                // for (let guest in this.ids) {
                                //     if (this.ids[guest].id !== key) {
                                //         flag++;
                                //     }
                                // }
                                // if (Object.keys(this.ids).length === flag) {
                                //     console.log(response[key]);
                                //     if (response[key].search(reg) != -1 && searchField.value.length != 0) {
                                //         this.createUser(response[key], outputField, 'multiselect-widget__force-right');
                                //         this.countRight++;

                                //         this.counter(this.rightField, this.userCountRight);
                                //         this.counter(this.leftField, this.userCountLeft);

                                //         this.users[Object.keys(this.users).length] = {id: key, name: response[key]};

                                //         console.log(this.ids);
                                //     }
                                // }
                                // flag = 0

                                if (response[key].search(reg) != -1 && searchField.value.length != 0) {
                                    this.users[Object.keys(this.users).length] = {id: key, name: response[key]};
                                }
                            }
                            for (let key in this.users) {
                                for (let obj in this.ids) {
                                    if(key !== obj) {
                                        flag++;
                                    }
                                }
                            }
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
                    
                    for (let key in this.users) {
                        this.ids[key] = this.users[key];
                    }

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

                    this.leftField.innerHTML = '';
                    // outputField.innerHTML = '';

                    for (let key in this.ids) {
                        this.users[key] = this.ids[key];
                    }

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
                                this.ids[key] = this.users[key];
                                delete this.users[key];
                            }
                        }
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
                                this.users[key] = this.ids[key];
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

        init() {
            this.getUsers(this.searchField, this.rightField);
            this.redirectAllRight(this.rightArrow, this.leftField);
            this.redirectAllLeft(this.leftArrow, this.rightField);
            this.search(this.buttonSearch);
            this.redirectOneRight(this.rightField, this.leftField);
            this.redirectOneLeft(this.leftField, this.rightField);
        }
    }

    new MultiWidget('.multiselect-widget__list-content--left', '.multiselect-widget__list-content--right', '.multiselect-widget__header-text--left', '.multiselect-widget__header-text--right', '.multiselect-widget__header-search', '.multiselect-widget__button--arrow-left', '.multiselect-widget__button--arrow-right', '.multiselect-widget__button--search', 'js/db.json', 'multiselect-widget__force-right', '.multiselect-widget__count--left', '.multiselect-widget__count--right').init();
}());