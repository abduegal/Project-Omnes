package controllers;

import java.util.List;

import org.codehaus.jackson.JsonNode;

import models.Message;
import play.data.*;
import play.libs.Json;
import play.mvc.*;


public class Messages extends Controller {
	
	
	public static Result post() {
		Form<Message> data = Form.form(Message.class).bindFromRequest();		
		
		if(data.hasErrors()) {
			return badRequest();
		}
		
		Message m = data.get();
		m.save();
		
		return ok();
	}
	
	public static Result put() {
		
		
		return badRequest();
	}

	public static Result delete(long id) {
		
		
		return badRequest();
	}

	public static Result get(double range, double lng, double lat) {
		
		List<Message> result = Message.findByGeolocation(lng, lat, range);
		
		if(result.isEmpty()) return badRequest();
		
		return ok(Json.toJson(result));
				
			
	}


}
