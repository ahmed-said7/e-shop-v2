const { json } = require("body-parser");

class apiFeatures{
    constructor(mongooseQuery,queryObj){
        this.mongooseQuery = mongooseQuery;
        this.queryObj = queryObj;
    };
    filter(){
        let filterObj={...this.queryObj};
        let excludedFields=['page','sort','keyword','fields','limit'];
        excludedFields.forEach((ele)=>{delete filterObj[ele];});
        let filterStr=JSON.stringify(filterObj);
        filterStr=filterStr.replace(/\b(gte|lte|lt|gt)\b/ig,(val)=>{return `$${val}`;});
        this.mongooseQuery=this.mongooseQuery.find(JSON.parse(filterStr));
        return this;
    };
    sort(){
        if(this.queryObj.sort){
            let sort=this.queryObj.sort.split(',').join(' ');
            this.mongooseQuery=this.mongooseQuery.sort(sort);
        }
        return this;
    };
    search(documentName){
        if(this.queryObj.keyword){
            let search={};
            if(documentName==='products'){
                search.$or=[{title:{$regex:this.queryObj.keyword}}
                ,
                {description:{$regex:this.queryObj.keyword}}
                ]
            }else{
                search={name:{$regex:this.queryObj.keyword}};
            }
            this.mongooseQuery=this.mongooseQuery.find(search);
        }
        return this;
    }
    limit(){
        if(this.queryObj.fields){
            let fields=this.queryObj.fields.split(',').join(' ');
            this.mongooseQuery=this.mongooseQuery.select(fields);
        }
        return this;
    };
    pagination(countDocuments){
        let page=this.queryObj.page || 1;
        let limit=this.queryObj.limit || 5;
        let skip=(page-1)*limit;
        let endIndex=page*limit;
        let objectPagination={};
        objectPagination.currentPage=page;
        objectPagination.numOfPages=Math.ceil(countDocuments/limit);
        if(endIndex < countDocuments){
            objectPagination.nextPage=page+1;
        }
        if(skip>0){
            objectPagination.prePage=page-1;
        }
        this.objectPagination=objectPagination;
        this.mongooseQuery=this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
};
module.exports=apiFeatures;