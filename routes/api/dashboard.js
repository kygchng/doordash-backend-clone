const express = require("express");
const router = express.Router();

const Item = require("../../models/Item");
const Menu = require("../../models/Menu");
const Order = require("../../models/Order");
const Restaurant = require("../../models/Restaurant");
var ObjectId = require("mongodb").ObjectId;

router.post("/restaurant/register", async(req, res) => {
    const user = await Restaurant.findOne({email: req.body.email}); //query to find if the user inputted email already exists in any document, sends back entire document
    if(user) {
        return res.status(400).send({}); //user error - user already exists
    } else { //user doesn't exist
        const newRestaurant = new Restaurant(req.body); //creates new document with everything in the body
        newRestaurant.save().catch(err => console.log(err)); //.save is API call to mongoDB. if it fails, an error object is sent back to you (err) and is printed
        return res.status(200).send(newRestaurant); 
    };
}); //full API endpoint = /api/v1/dashboard/restaurant/register

router.get("/fetch/restaurants", async(req, res) => {
    const restaurantList = await Restaurant.find(); //await makes the mongoose .find behave synchronously (finish this line before moving on)
    return res.status(200).send(restaurantList); //returns JSON array
});

router.get("/fetch/restaurant/:email", async(req, res) => {
    const restaurant = await Restaurant.findOne({email: req.params.email});
    if(restaurant) {
        return res.status(200).send(restaurant);
    } else {
        return res.status(404).send({});
    }
});

router.put("/update/restaurant", async(req, res) => {
    const query = {email: req.body.email};
    const updatedValues = {
        restaurant_name: req.body.restaurant_name,
        restaurant_menu: req.body.restaurant_menu,
        restaurant_category_tags: req.body.restaurant_category_tags,
        email: req.body.email,
        about_description: req.body.about_description,
        availability: req.body.availability,
        wait_time: req.body.wait_time
    };
    const updatedRestaurant = await Restaurant.findOneAndUpdate(query, updatedValues);
    if(updatedRestaurant) {
        return res.status(200).send(updatedValues); //findOneandUpdate returns the original restaurant, not updated
    } else {
        return res.status(400).send({}); //user error - try to update a restaurant that doesn't exist
    }
});

router.delete("/delete/restaurant/:email", async(req, res) => {
    const response = await Restaurant.deleteOne({email: req.params.email});
    console.log(response);
    if(response.deletedCount == 1) {
        return res.status(200).send(response); //deletedCount = 1 restaurant successfully deleted
    } else {
        return res.status(400).send({}); //user error - try to delete a restaurant that doesn't exist
    }
});

router.post("/add/menu", async(req,res) => {
    const restaurantId = ObjectId(req.body.restaurant_id); //converts req.body.restaurant_id (string) into ObjectId using mongoDB constructor
    const validRestaurant = await Restaurant.findById(restaurantId); //passes in ObjectId into Mongoose API call
    if(!validRestaurant) {
        return res.status(400).send({}); //user - try to add a menu to nonexistent restaurant
    } else {
        const duplicateMenus = await Menu.find({menu_name: req.body.menu_name, restaurant_id: req.body.restaurant_id}); //check if the restaurant has a menu with the same name
        //check size of duplicateMenus
        if(duplicateMenus.length != 0) {
            return res.status(400).send({}); //menu exists
        } else { //add this new menu! 
            const newMenu = new Menu(req.body);
            newMenu.save().catch(err => console.log(err));
            return res.status(200).send(newMenu);
        }
    }
});

router.get("/fetch/menus/:restaurantId", async(req,res) => {
    const menuList = await Menu.find({restaurant_id: req.params.restaurantId});
    return res.status(200).send(menuList);
});

router.delete("/remove/menu/:menuID", async(req,res) => {
    const menu_id = ObjectId(req.params.menuID);
    const deletedMenu = await Menu.findOneAndDelete({_id: menu_id});
    if(deletedMenu) {
        return res.status(200).send(deletedMenu);
    } else {
        return res.status(400).send({}); //user entered a nonexistent menu to delete
    }
});

router.post("/add/item/menu", async(req,res) => {
    const menuId = ObjectId(req.body.menu_id);
    //check if menu exists
    const menu = await Menu.findById(menuId);
    if(!menu) {
        //menu is undefined (doesn't exist)
        return res.status(404).send({});
    } else {
        //check if it has a duplicate item with same name
        const duplicateItem = await Item.find({menu_id: req.body.menu_id, item_name: req.body.item_name});
        if(duplicateItem.length != 0) {
            //duplicates exists
            return res.status(400).send({});
        } else {
            //no duplicate items
            const newItem = new Item(req.body);
            newItem.save().catch(err => console.log(err));
            return res.status(200).send(newItem);
        }
    }
});

router.get("/fetch/items/:menuId", async(req,res) => {
    const items = await Item.find({menu_id: req.params.menuId});
    return res.status(200).send(items); //could check if menu exists but too lazy
});

module.exports = router; //exports