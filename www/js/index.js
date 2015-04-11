/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var globalDBVariable;
var globalPhoneVariable;

document.addEventListener('deviceready', this.onDeviceReady, false);

function onDeviceReady() {
    initialDatabaseOperation();
}

function initialDatabaseOperation() {
    globalDBVariable = window.openDatabase("PhoneBook.db", "1.0", "PhoneBook contacts database.", 1000000);
    globalDBVariable.transaction(createDatabase, error, success);
}

function createDatabase(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS PhoneBook (name, phone, email)');
}

function insertContact() {
    globalDBVariable.transaction(onInsertContact, error, success);
}

function onInsertContact(tx) {
    var name = $('#name').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    if (name.length > 0 && phone.length > 0 && email.length > 0) {
        tx.executeSql('INSERT INTO PhoneBook (name, phone, email) VALUES ("' + name + '", "' + phone + '","' + email + '")');
    } else {
        alert("Please enter all data.");
    }
}

function updateContact() {
    globalDBVariable.transaction(onUpdateContact, error, success);
}

function onUpdateContact(tx) {
    var name = $('#name').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    if (name.length > 0 && phone.length > 0 && email.length > 0) {
        alert('UPDATE PhoneBook SET name="' + name + '", email="' + email + '" WHERE phone="' + phone + '"');
        tx.executeSql('UPDATE PhoneBook SET name="' + name + '", email="' + email + '" WHERE phone="' + phone + '"');
    } else {
        alert("Please enter all data.");
    }
}

function selectContact(phone) {    
    globalPhoneVariable = phone;
    globalDBVariable.transaction(onSelectContact, error);
}

function onSelectContact(tx, phone) {
    tx.executeSql('SELECT * FROM PhoneBook WHERE phone="' + globalPhoneVariable + '"', [], onSelectSuccess, error);
}

function onSelectSuccess(tx, results) {
    var len = results.rows.length;

    if(len > 0) {
        $('#name').val(results.rows.item(0).name);
        $('#phone').val(results.rows.item(0).phone);
        $('#email').val(results.rows.item(0).email);
    }
}

function queryContact() {
    globalDBVariable.transaction(onQueryContact, error);
}

function onQueryContact(tx) {
    tx.executeSql('SELECT * FROM PhoneBook', [], onQuerySuccess, error);
}

function onQuerySuccess(tx, results) {
    var contactList = "";
    var len = results.rows.length;

    for (var i = 0; i < len; i++) {
        contactList += '<li class="contact-item" onclick="selectContact(' + results.rows.item(i).phone + ')"><a style="color:black; text-decoration:none;" href="#home"><div><h1>' + results.rows.item(i).name + '</h1><p>' + results.rows.item(i).email + '</p><p class="phone">' + results.rows.item(i).phone + '</p></div></a></li>';
    }

    $("#contact-list").html(contactList);
}

function error(err) {
    alert("Error processing SQL: " + err.code);
}

function success() {
    //alert("success!");
}