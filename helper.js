module.exports = function () {
   
// Function to Format JSON
 this.jsonFormat= function  (inputJSON, parentId=null) {
        var i, j, branch=[];
        // Multiple loops to get to each items.
        for(i=0; i< Object.keys(inputJSON).length; i++){
            for(j in inputJSON[i]){

                // comparing all parent id with child parent id
                if(inputJSON[i][j].parent_id == parentId){
                    var children = this.jsonFormat(inputJSON, inputJSON[i][j].id);

                   //if the child response not empty, then add the child under the current parent
                    if(children.length){
                        inputJSON[i][j].children=children;
                    }
                    branch.push(inputJSON[i][j]);
                }
            }
        }
        return branch;
    };

    // To Format the data into HTML Table.
    this.htmlTableFormating = function (data, page, host) {
        if(data && page && host){
            var x,i;
            // Table Head
            var html = '<h4><a href="/">Home</a></h4><br><table border="1px solid #dddddd">';
            html += '<tr><th colspan="4"><h1>NodeJS Repos</h1></th></tr>';
            html += '<tr><th>Name</th><th>Description</th><th>Git Clone URL</th><th> Star Counts</th></tr>';

            // Looping through the data to give a server side template of the table. 
            for (i in data) {
                for (x in data[i]) {
                    html += '<tr>'

                    html += '<td> <a target="_BLANK" href="' + data[i][x].html_url + '"> ' + data[i][x].name + ' </a></td>'
                    html += '<td>' + data[i][x].description + '</td>'
                    html += '<td><a href="' + data[i][x].clone_url + '"> '+ data[i][x].clone_url +'</a></td>'
                    html += '<td>' + data[i][x].stargazers_count + '</td>'

                    html += '</tr>'
                }
            }
            // Settings for Pagination in Table
            if(page==1){
                html += '<tr><th colspan="4"> <b>1</b> &nbsp&nbsp <a href="//'+host+'/github-api?page='+ (parseInt(page)+1) +'">Next</a></th></tr>';
            }else{
                html += '<tr><th colspan="4"> <a href="//'+host+'/github-api?page='+ (page-1) +'">Prev</a>  &nbsp&nbsp <b> '+page+' </b> &nbsp&nbsp <a href="//'+host+'/github-api?page='+ (parseInt(page)+1) +'">Next</a> </th></tr>';
            }

            html += '</table>'
        return html;

        }
        
    }
};
