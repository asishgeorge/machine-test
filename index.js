'use strict';

const Hapi = require('@hapi/hapi');
const fetch = require("node-fetch");
const Helper = require('./helper.js');

const helper = new Helper();
const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // Routes => 

    // Intro Page
    server.route({
        method:'GET',
        path:'/',
        handler: function(req) {
            return `<h1>The Swagger for PineTech NodeJS.</h1> <br>For the solution of Part 1 send a POST request to http:localhost:3000/json-format with the required JSON<br> <br>For the solution of second part, <a href='/github-api'> Click Here</a>`
        }
    })

    // Challenge Part 1

    server.route({
        method:'POST',
        path:'/json-format',
        handler: function(req, res) {
            const inputJSON = req.payload;
            return helper.jsonFormat(inputJSON);
        }
    });

    

    // Challenge Part 2

    server.route({
        method:'GET',
        path:'/github-api',
        handler: function(request) {
            
            const params = request.query
            const host = request.info.host;

            var url, page, root = "https://api.github.com/search/repositories?q=nodejs&per_page=10&sort=stars&order=desc";

            // Logic for Pagination 
            if(params.page == 'undefined' || params.page ==1){
                url = root;
                page = 1;
            }else {
                url = root+"&page="+params.page;
                try{
                    page = parseInt(params.page);
                }catch(e) {
                    page=1;
                }
                 if(!Number.isInteger(page)){
                    page=1;
                }

                // Page number greater than 100 will be routed back to page 1
                if(page>100){
                    return 'Only the first 1000 search results are available. As limited by GitHub API.  Return to <a href="//'+host+'/github-api?page=1">Page 1</a>';
                }
               
            }

            // Calling the GitHub API
            return fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data && data.length != 0){
                     return helper.htmlTableFormating(data, page, host);
                }
              
            }).catch(e => console.log(e));

        }
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});


init();