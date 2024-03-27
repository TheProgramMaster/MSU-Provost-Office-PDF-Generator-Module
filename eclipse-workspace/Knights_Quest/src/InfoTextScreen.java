import java.awt.Graphics;
import java.awt.Image;
import java.io.IOException;
import java.net.URL;

import javax.imageio.ImageIO;
import javax.swing.JTextArea;

public class InfoTextScreen extends JTextArea{
	private Image img;
	public InfoTextScreen(int a, int b) {
		super(a, b);
		try {
			img = ImageIO.read(new URL("https://c4.wallpaperflare.com/wallpaper/779/824/841/pixel-art-8-bit-wallpaper-preview.jpg"));
		}catch(IOException e) {
			System.out.println(e.toString());
		}
	}
	@Override
	protected void paintComponent(Graphics g) {
		g.drawImage(img, 0, 0, null);
		super.paintComponent(g);
	}
}
