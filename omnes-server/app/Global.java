import models.Message;
import play.Application;
import play.GlobalSettings;


public class Global extends GlobalSettings {

	@Override
	public void onStart(Application arg0) {
	
		super.onStart(arg0);
		
		Message.messages().ensureIndex("{\"location\": \"2dsphere\"}");
	}
	
	

}
