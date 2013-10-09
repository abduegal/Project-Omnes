package controllers;

import play.*;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {

	public static void AllowOrigin() {
		System.out.println(request().getHeader("origin"));
		response().setHeader("Access-Control-Allow-Origin",
				"http://abduegal.github.io");
		response().setHeader("Access-Control-Allow-Methods",
				"GET, POST, PUT, DELETE, OPTIONS");
		response().setHeader("Access-Control-Max-Age", "300");
		response().setHeader("Access-Control-Allow-Credentials", "true");
		response().setHeader("Access-Control-Allow-Headers",
				"accept, origin, x-requested-with, content-type");
	}

	public static Result index() {

		return ok(index.render("Your new application is ready."));
	}

	public static Result options(String path) {
		AllowOrigin();
		return ok("options");
	}

}
