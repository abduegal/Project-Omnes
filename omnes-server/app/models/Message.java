package models;

import java.util.List;

import org.bson.types.ObjectId;
import org.codehaus.jackson.annotate.JsonProperty;
import org.jongo.MongoCollection;
import org.jongo.marshall.jackson.oid.Id;

import com.google.common.collect.Lists;

import play.data.validation.Constraints.*;
import uk.co.panaxiom.playjongo.PlayJongo;

public class Message {

	public static MongoCollection messages() {
		return PlayJongo.getCollection("messages");
	}

	@Id
	private ObjectId id;

	@Required
	private String content;

	@Required
	private String username;

	@Required
	private double[] location = new double[2];
	
	@Required
	private long timestamp;

	public void save() {
		messages().save(this);
	}

	public void delete() {
		messages().remove(this.id);
	}

	public static List<Message> findByGeolocation(double lng, double lat, double range) {
		
		//convert kilometers to radians
		double radians = range/6371;
		
		String query = "{\"location\" : {$geoWithin : {$centerSphere : [["+lng+" ,"+ lat + "], "+ radians +" ]}}}";
		
		
		
		return Lists.newArrayList(messages().find(query).as(Message.class));
		
		
		
	}
	

	// getters and setters
	
	

	public long getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}

	public String getContent() {
		return content;
	}

	public double[] getLocation() {
		return location;
	}

	public void setLocation(double[] location) {
		this.location = location;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}
