<?php
header('Access-Control-Allow-Origin: *');
require_once '../bin/library.php'; 
require_once 'bin/includes.php'; 
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="content-language" content="is" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Sirrý">
<meta property="og:url" content="https://maxnaylor.co.uk/sirry/">
<meta property="og:description" content="Snjall aðstoðarmaður sem talar þitt mál.">
<meta property="og:image" content="https://maxnaylor.co.uk/sirry/images/icon-256.png">
<meta property="og:locale" content="is_IS" />
<title>Sirrý – Atburðaskrá</title>
</head>
<body>	
	<div class="container">
		<nav>
			<img src="../images/logo.svg" />
			<h1><strong>Sirrý</strong>&nbsp;Atburðaskrá</h1>
		</nav>
		<section>
			<table>
				<tr>
					<th>Auðkenni</th>
					<th>Uppruni</th>
					<th>Fyrirspurn</th>
					<th>Svar</th>
					<th>IP-tala</th>
					<th>Sent</th>
				</tr>
				<?php
				$q = "SELECT * FROM queries				
				     JOIN responses ON queries.q_response = responses.r_id
				     ORDER BY queries.q_sent DESC
				     LIMIT 0, 50";
				$r = mysqli_query($link, $q);
				if($r && mysqli_num_rows($r)>0) {
					while($row = mysqli_fetch_array($r)) {
						switch ($row['q_source']) {
							case '0':
								$source = 'Óþekkt';
								break;
							case '1':
								$source = 'Vefapp';
								break;
							case '2':
								$source = 'API';
								break;
						} 
						?>
						<tr<?php if($row['q_unknownInput']) { echo ' class="red"'; }; ?>>
							<td><?php echo $row['q_id']; ?></td>
							<td><?php echo $source; ?></td>
							<td><?php echo $row['q_text']; ?></td>
							<td><?php echo $row['r_text']; ?></td>
							<td><?php echo $row['q_ip']; ?></td>
							<td><?php echo strftime('%a. %e. %b %Y kl. %H:%M:%S', strtotime($row['q_sent'])); ?></td>
						</tr>
						<?php
					}
				} else {
					?>
					<tr>
						<td colspan="6" class="empty">Enginn atburður á skrá</td>
					</tr>
					<?php
				}
				?>
			</table>
		</section>
	</div>
</body>
</html>