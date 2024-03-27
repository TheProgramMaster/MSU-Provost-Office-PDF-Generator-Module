import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.*;
import java.io.*;
import java.net.URL;
import javax.imageio.*;
import javax.swing.*;
public class TitleScreen {
	public static Icon resizeIcon(ImageIcon icon, int resizedWidth, int resizedHeight) {
		Image img = icon.getImage();
		Image resizedImage = img.getScaledInstance(resizedWidth, resizedHeight, java.awt.Image.SCALE_SMOOTH);
		return new ImageIcon(resizedImage);
	}
	JFrame frame = new JFrame("Knight's Quest");
	JPanel titlePanel = new JPanel();
	JPanel buttonPanel = new JPanel();
	JLabel titleLabel = new JLabel();
	JLabel label = new JLabel();
	ImageIcon storyButtonIcon = new ImageIcon("C:\\Users\\gavin\\OneDrive\\Desktop\\download.png");
	JButton button = new JButton(storyButtonIcon);
	ImageIcon playButtonIcon = new ImageIcon("C:\\Users\\gavin\\OneDrive\\Documents\\play.png");
	JButton button2 = new JButton(storyButtonIcon);
	ImageIcon titleImageIcon = new ImageIcon("C:\\Users\\gavin\\OneDrive\\Documents\\title.png");
	ActionListener listener = new ButtonListener();
	public TitleScreen() throws IOException {
		frame.setSize(500,500);
		frame.setLayout(new BorderLayout());
		button.addActionListener(listener);
		button2.addActionListener(listener);
		//Create background image of title screen.
		URL backgroundUrl = new URL("https://th.bing.com/th/id/OIP.-V2E83bR3PIwgwGWz07V0gHaEK?pid=ImgDet&rs=1");
		BufferedImage bufferedImage = ImageIO.read(backgroundUrl);
		Image image = bufferedImage.getScaledInstance(frame.getWidth(),frame.getHeight(),Image.SCALE_DEFAULT);
		ImageIcon icon = new ImageIcon(image);
		label.setIcon(icon);
		//Create Title Label.
		titleLabel.setIcon(titleImageIcon);
		//Add play button to title screen.
		button.setBounds(frame.getWidth()/3*2,frame.getHeight()/5,frame.getWidth()/5,frame.getHeight()/10);
		label.add(button);
		int offset = button.getInsets().left;
		button.setIcon(resizeIcon(playButtonIcon,button.getWidth()-offset,button.getHeight()-offset));
		//Add Story button to title screen.
		button2.setBounds(frame.getWidth()/3*2,frame.getHeight()/5*3,frame.getWidth()/5,frame.getHeight()/10);
		label.add(button2);
		int offset2 = button2.getInsets().left;
		button2.setIcon(resizeIcon(storyButtonIcon,button2.getWidth()-offset2,button2.getHeight()-offset2));
		buttonPanel.add(label);
		frame.add(label,BorderLayout.EAST);
		titlePanel.add(titleLabel);
		frame.add(titleLabel,BorderLayout.WEST);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}
	public static void main(String[] args) throws IOException {
		TitleScreen t = new TitleScreen();
	}
	public class ButtonListener implements ActionListener{

		@Override
		public void actionPerformed(ActionEvent e) {
			// TODO Auto-generated method stub
			if(e.getSource()==button) {
				frame.dispose();
			}
			//Goes to screen giving information of game when user clicks the "Story"
			//button.
			if(e.getSource()==button2) {
				frame.dispose();
				try {
					StoryText t = new StoryText();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			}
		}
		
	}
}