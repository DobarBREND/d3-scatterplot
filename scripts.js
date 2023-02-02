let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();

let values =[];

let xScale
let yScale

let xAxis
let yAxis

let width = 900;
let height = 600;
let padding = {top: 40, right: 30, bottom: 70, left: 70};


let border = 1;
let bordercolor = "rgba(0,0,0,0.5)";


let svg = d3.select("svg");
let tooltip = d3.select("#tooltip").style("fill", "aquamarine");
    
let createScales = () => {
    
    xScale = d3.scaleLinear()
                        .domain([d3.min(values, (item) => {
                            return item["Year"]
                        }) - 1 , d3.max(values, (item) => {
                            return item["Year"]
                        }) + 1])
                        .range([padding.left, width-padding.left])

    yScale = d3.scaleTime()
                        .domain([d3.min(values, (item) => {
                            return new Date(item["Seconds"] * 1000)
                        }), d3.max(values, (item) => {
                            return new Date(item["Seconds"] * 1000)
                        })])
                        .range([padding.bottom, height-padding.bottom])

                svg.append("text")
                        .style("text-anchor", "middle")
                        .attr("fill", "black")
                        .text("Time in Minutes")
                        .style("font-size", "18px")
                        .style("fill", "whitesmoke")
                        .attr("transform", "translate(25,280)rotate(-90)");
};

let createCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
};

let createPoints = () => {

    svg.selectAll("circle")
            .data(values)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("r", "7")
            .attr("data-xvalue", (item) => {
                return item["Year"]
            })
            .attr("data-yvalue", (item) => {
                return new Date(item["Seconds"] * 1000)
            })
          .attr("cx", (item) => {
              return xScale(item["Year"])
          })         
            .attr("cy", (item) => {
                return yScale(new Date(item["Seconds"] * 1000))
            })
            .attr("fill", (item) => {
                if(item["URL"] === ""){
                    return "aquamarine"
                }else{
                    return "orange"
                }
            })
            .attr("border", border)
            .attr("stroke", bordercolor)
            .on("mouseover", (event, item) => {
                tooltip.transition()
                    .style("visibility", "visible")
                    .style("text-anchor", "middle")
                
                if(item["Doping"] != ""){
                    tooltip.text(item["Year"] + " - " + item["Name"] + " - " + item["Time"] + " - " + item["Doping"])
                    .style("fill", "orange")
                   
                }else{
                    tooltip.text(item["Year"] + " - " + item["Name"] + " - " + item["Time"] + " - " + "No Allegations")
                    .style("fill", "aquamarine")
                }
                
                tooltip.attr("data-year", item["Year"])
            })
            .on("mouseout", (event, item) => {
                tooltip.transition()
                    .style("visibility", "hidden")
            })
};

        svg.append("line")
            .attr("x1", 625)
            .attr("x2", 895)
            .attr("y1", 350)
            .attr("y2", 350)
            .attr("stroke", "lightgray");

        svg.append("line")
            .attr("x1", 625)
            .attr("x2", 830)
            .attr("y1", 270)
            .attr("y2", 270)
            .attr("stroke", "lightgray");
       
       svg.append("text")
            .attr("transform", "translate(450,580)")
            .style("text-anchor", "middle")
            .attr("fill", "black")
            .text("Year")
            .style("font-size", "18px"); 

            

let myimage = svg.append("image")
            .attr("xlink:href", "https://cdn.pixabay.com/photo/2020/11/11/15/12/cyclist-5732774_960_720.png")
            .attr("width", 270)
            .attr("height", 270)
            .attr("x", 700)
            .attr("y", -75)
            .attr("transform", "rotate(5)");

let createAxes = () => {

    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format("d"))
                

    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat("%M:%S"))


    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (height-padding.bottom) +")")

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform","translate(" + padding.left + ", 0)");
};


req.open("GET", url, true)

req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    createCanvas()
    createScales()
    createPoints()
    createAxes()
};

req.send();