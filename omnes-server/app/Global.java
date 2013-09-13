import play.Application;
import play.GlobalSettings;
import uk.co.panaxiom.playjongo.PlayJongo;

public class Global extends GlobalSettings {

	@Override
	public void beforeStart(Application arg0) {
		super.beforeStart(arg0);
		
				
		PlayJongo.getCollection("messages").ensureIndex("{location: 2dsphere}");
		
	}
	
	

}