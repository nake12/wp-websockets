    'use strict';
    $(function() {/* global $ obapi Handlebars */
    
        obapi.connect('https://wp-websockets-potofcoffee2go.c9users.io');

        // Catch-all obapi custom websocket events
        //  (will not see regular socket.io connect/disconnect/etc events)
        //  Handy for displaying stuff during debug
        obapi.on('*',function(event, msg) {
            console.log('***', event, '***', msg);
        });

        /// Standard socket.io events
        //  socket.io connect
        obapi.on('connect', function() {
            console.log('Established WebSocket connection to auction server');
        });
        //  socket.io disconnect
        obapi.on('disconnect', function() {
            console.log('WebSocket disconnected from auction server');
        });

        /// Custom socket.io events
        /*
        All custom socket.io events contain :
        {
            resource: 'the resource (or path) requested',
            data: object {} containing the data requested,
            location: 'the resource (or path) actually retrieved',
            error: {name and message of error } or null if no error
        }
        */

        //  Connection accepted
        obapi.on('Connected', function(msg) {
            console.log('Connected to auction server');
            obapi.get('/api/auctions/auction');    // Get all auctions
            obapi.get('/api/auctions/user');       // Get all users
            obapi.get('/api/messages');            // Get all messages
            obapi.get('/db/storage/should work');        // Get all general purpose collections
            obapi.put('/db/storage/should work/again three', {FromWebPage3: {from:'web', to:'page4'}});        // Get all general purpose collections
        });

        obapi.on('Get', function(msg) {
            // List of users?  Populate #users-info
            if (msg.location && msg.location.indexOf('/api/auctions/user') === 0) {
                $('#users-info').html('');
                var usersTemplate = Handlebars.compile($('#users-info-template').html());
                Object.keys(msg.data.user).forEach(function(user) {
                    $('#users-info').append(usersTemplate(msg.data.user[user]));
                });
            }
            // List of auctions? Populate #auction-items
            else if (msg.location && msg.location.indexOf('/api/auctions/auction') === 0) { 
                $('#auction-items').html('');
                var auctionsTemplate = Handlebars.compile($('#auction-item-template').html());
                Object.keys(msg.data.auction).forEach(function(item) {
                    $('#auction-items').append(auctionsTemplate(msg.data.auction[item]));
                });
            }

            if (msg.error) {
                console.log(msg.error.name, ': ', msg.error.message);
            }
        });

        obapi.on('Put', function(msg) {
            console.log(msg);
        });
        
        obapi.on('Post', function(msg) {
            console.log(msg);
        });
        
        $( "#about" ).click(function() {
            // console.log( "Handler for about .click() called." );
            var codeUrl = 'https://wp-websockets-potofcoffee2go.c9users.io/api/auctions/auction/a117';
            
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        var responseJson = JSON.parse(xmlhttp.responseText);
                        $('#post1 img').attr('src', responseJson.auction.a117.meta.wdm_auction_thumb);
                        $('#post1 h3').html(responseJson.auction.a117.post.post_title);
                        $('#post1 p:first').html(responseJson.auction.a117.post.post_content);
                    }
                    else {
                        throw new Error('markupcode: get source file returned status ' + xmlhttp.status);
                    }
                }
            };
            xmlhttp.open('GET', codeUrl, true);
            xmlhttp.send();

        });
        
        $( "#services" ).click(function() {
            console.log( "Handler for services .click() called." );
        });
        
        $( "#contact" ).click(function() {
            console.log( "Handler for contact .click() called." );
        });
        
        $( "#call-to-action" ).click(function() {
            console.log( "Handler for call-to-action .click() called." );
        });

        obapi.auctionClick = function auctionClick(item) {
            alert(item + ' Auction Page');
        }
        
        obapi.moreInfoClick = function moreInfoClick(item) {
            alert(item+ ' More Info Page');
        }

        console.log( "ready!" );
    });
